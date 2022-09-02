import chalk from 'chalk'
import net from 'net'
import { performance } from 'node:perf_hooks'

import Entity from './entity/Entity'
import World from './world/World'
export { Entity }
export { World }

import './util/MathUtils'

import Client from './client/Client'
import BlockPos from './datatypes/BlockPos'
import { Difficulty } from './datatypes/PlayEnums'
import { UUIDResolvable } from './datatypes/UUID'
import Player from './entity/player/Player'
import S2CChunkDataAndUpdateLightPacket from './network/packets/play/S2CChunkDataAndUpdateLightPacket'
import S2CDeclareRecipesPacket from './network/packets/play/S2CDeclareRecipesPacket'
import S2CEntityStatusPacket, { EntityStatus } from './network/packets/play/S2CEntityStatusPacket'
import S2CHeldItemChangePacket from './network/packets/play/S2CHeldItemChangePacket'
import S2CInitializeWorldBorderPacket from './network/packets/play/S2CInitializeWorldBorderPacket'
import S2CJoinGamePacket from './network/packets/play/S2CJoinGamePacket'
import S2CPlayerAbilitiesPacket from './network/packets/play/S2CPlayerAbilitiesPacket'
import S2CPlayerInfoPacket, { PlayerInfoAction } from './network/packets/play/S2CPlayerInfoPacket'
import S2CPlayerPositionAndLookPacket from './network/packets/play/S2CPlayerPositionAndLookPacket'
import S2CPluginMessagePacket from './network/packets/play/S2CPluginMessagePacket'
import S2CServerDifficultyPacket from './network/packets/play/S2CServerDifficultyPacket'
import S2CSpawnPositionPacket from './network/packets/play/S2CSpawnPositionPacket'
import S2CTagsPacket from './network/packets/play/S2CTagsPacket'
import S2CUnlockRecipesPacket, { UnlockRecipesAction } from './network/packets/play/S2CUnlockRecipesPacket'
import S2CUpdateViewPositionPacket from './network/packets/play/S2CUpdateViewPositionPacket'
import S2CPacket from './network/packets/S2CPacket'
import ServerBoundPacketBuffer from './network/ServerBoundPacketBuffer'
import ServerBoundPacketManager from './network/ServerBoundPacketManager'
import MathUtils from './util/MathUtils'
import RollingArray from './util/RollingArray'

interface Tick {
    start: number
    end: number
    delta: number
}
export default class MinecraftServer {
    static readonly VERSION = '1.0-alpha'
    static readonly PROTO_VERSION = 758
    static readonly MC_VERSION = '1.18.2'
    static readonly INSTANCE = new MinecraftServer()

    static readonly ONLINE_MODE = false
    static readonly PACKET_COMPRESSION_THRESHOLD = 1_000

    private static readonly MAX_TPS = 4
    private static readonly MAX_MSPT = 1000 / MinecraftServer.MAX_TPS

    private readonly TICK_HISTORY = new RollingArray<Tick>(
        MinecraftServer.MAX_TPS * 60 /* Store at most the last 1 minute of tick history */
    )

    private readonly tcpServer: net.Server
    clients: Map<string, Client>
    packetHandler: ServerBoundPacketManager

    constructor() {
        this.tcpServer = net.createServer()
        this.clients = new Map()
        this.packetHandler = new ServerBoundPacketManager()

        this.init()
    }

    init() {
        this.tcpServer.on('connection', conn => {
            const remoteAddress = conn.remoteAddress + ':' + conn.remotePort

            console.log(chalk.magentaBright('New client connection from:'), remoteAddress)

            const client = new Client(conn)
            this.clients.set(remoteAddress, client)

            conn.on('data', buff => {
                const packetBuffs = ServerBoundPacketBuffer.separateFromRawBuffer(buff, client.compressionEnabled)

                for (let packetBuffer of packetBuffs) {
                    this.packetHandler.handle(client, packetBuffer)
                }
            })

            conn.once('close', () => {
                console.log(chalk.yellow(`Connection from ${remoteAddress} closed`))
                this.clients.delete(remoteAddress)
                client.player?.onDisconnect()
                client.packetHandler?.onDisconnected()
            })
            conn.on('error', err => {
                console.log(chalk.redBright(`Connection ${remoteAddress} error:`), err.message)
                this.clients.delete(remoteAddress)
            })
        })

        this.tcpServer.listen(25566, () => {
            console.log(chalk.greenBright('Server listening on'), this.tcpServer.address())
        })

        // Start the main game loop
        this.gameLoop()
    }

    getPlayer(username: string): Player | null {
        return this.players.find(p => p.username === username) ?? null
    }

    getPlayerByUUID(uuid: UUIDResolvable) {
        return this.players.find(p => p.uuid.equals(uuid)) ?? null
    }

    get players(): Player[] {
        return Array.from(this.clients.values())
            .filter(c => !!c.player)
            .map(c => c.player!)
    }

    emitPacketToAllPlayers(packet: S2CPacket) {
        for (const player of this.players) {
            player.client.sendPacket(packet)
        }
    }

    async gameLoop() {
        const start = performance.now()

        await this.tick()

        const end = performance.now()

        const tickTime = end - start

        this.TICK_HISTORY.insert({
            start,
            end,
            delta: tickTime,
        })

        if (tickTime > MinecraftServer.MAX_MSPT) {
            const msOverMaxMSPT = tickTime - MinecraftServer.MAX_MSPT

            console.warn(chalk.yellow(`Tick took ${tickTime.toFixed(2)}ms (${msOverMaxMSPT.toFixed(2)}ms over limit)`))
        } else {
            // console.log(
            //     chalk.gray(
            //         `Tick took ${tickTime.toFixed(2)}ms (MSPT: ${this.mspt.toFixed(2)}ms) (TPS: ${this.tps.toFixed(1)})`
            //     )
            // )
        }

        process.nextTick(() => {
            const timeUntilNextTick = MinecraftServer.MAX_MSPT - (performance.now() - start)

            setTimeout(() => this.gameLoop(), timeUntilNextTick)
        })
    }

    async tick() {
        for (let client of this.clients.values()) {
            client.packetHandler.tick()
        }

        World.OVERWORLD.tick()

        // TODO regularly update ping for players
    }

    /**
     * Returns the average tick time in milliseconds over the last minute
     */
    get mspt() {
        const now = performance.now()

        // Filter out any ticks that are more than a minute old
        const lastMinute = this.TICK_HISTORY.filter(tick => tick.start > now - 1000 * 60)

        // Calculate the average tick time over the last minute
        return lastMinute.reduce((acc, tick) => acc + tick.delta, 0) / lastMinute.length
    }

    /**
     * Returns the average ticks per second over the last minute
     */
    get tps() {
        const now = performance.now()

        // Filter out any ticks that are more than a minute old
        const lastMinute = this.TICK_HISTORY.filter(tick => tick.start > now - 1000 * 60)

        const oldestTick = lastMinute[lastMinute.length - 1]
        const secondsSinceOldestTick = (now - oldestTick.start) / 1000

        // Calculate the number of ticks per second since the oldest tick (< 1m old) in the history
        return MathUtils.clamp(lastMinute.length / secondsSinceOldestTick, 0, MinecraftServer.MAX_TPS)
    }

    onPlayerConnect(client: Client, player: Player) {
        client.sendPacket(new S2CJoinGamePacket(player.id))

        client.sendPacket(S2CPluginMessagePacket.BRAND_PACKET)

        client.sendPacket(new S2CServerDifficultyPacket(Difficulty.EASY, true))

        client.sendPacket(new S2CPlayerAbilitiesPacket(player.abilities))

        client.sendPacket(new S2CHeldItemChangePacket(0))

        client.sendPacket(new S2CDeclareRecipesPacket())

        client.sendPacket(new S2CTagsPacket())

        client.sendPacket(new S2CEntityStatusPacket(player.id, EntityStatus.PLAYER_OP_0))

        // TODO Declare Commands

        client.sendPacket(new S2CUnlockRecipesPacket(UnlockRecipesAction.INIT))

        client.sendPacket(S2CPlayerPositionAndLookPacket.fromPosition(player.position))

        // Send player info to all clients
        MinecraftServer.INSTANCE.emitPacketToAllPlayers(
            new S2CPlayerInfoPacket(PlayerInfoAction.ADD_PLAYER, [player.playerInfo])
        )
        MinecraftServer.INSTANCE.emitPacketToAllPlayers(
            new S2CPlayerInfoPacket(PlayerInfoAction.UPDATE_LATENCY, [player.playerInfo])
        )
        MinecraftServer.INSTANCE.emitPacketToAllPlayers(
            new S2CPlayerInfoPacket(PlayerInfoAction.UPDATE_GAME_MODE, [player.playerInfo])
        )

        // Add player to world and tell other clients that need to know
        World.OVERWORLD.addEntity(player)

        client.sendPacket(
            new S2CUpdateViewPositionPacket(player.position.asChunkPos().x, player.position.asChunkPos().z)
        )

        // TODO Update Light

        for (let x = -4; x < 4; x++) {
            for (let z = -4; z < 4; z++) {
                if (x <= 2 && z <= 2) {
                    client.sendPacket(
                        new S2CChunkDataAndUpdateLightPacket(
                            x,
                            z,
                            S2CChunkDataAndUpdateLightPacket.FLAT_CHUNK_DATA,
                            S2CChunkDataAndUpdateLightPacket.EMPTY_LIGHT_DATA
                        )
                    )
                } else {
                    client.sendPacket(
                        new S2CChunkDataAndUpdateLightPacket(
                            x,
                            z,
                            S2CChunkDataAndUpdateLightPacket.EMPTY_CHUNK_DATA,
                            S2CChunkDataAndUpdateLightPacket.EMPTY_LIGHT_DATA
                        )
                    )
                }
            }
        }

        client.sendPacket(new S2CInitializeWorldBorderPacket())

        // TODO implement spawn position (for now it is always the origin)
        client.sendPacket(new S2CSpawnPositionPacket(BlockPos.ZERO, 0))

        client.sendPacket(S2CPlayerPositionAndLookPacket.fromPosition(player.position))

        // TODO Wait for teleport confirm before sending more packets

        // Send all the entities in range of the player
        for (const entity of player.getEntitiesInViewableRange()) {
            client.sendPacket(entity.createSpawnPacket())
        }

        // TODO Send inventory
    }
}
