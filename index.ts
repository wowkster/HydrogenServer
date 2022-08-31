import { performance } from 'node:perf_hooks'
import net from 'net'
import chalk from 'chalk'

import './util/MathUtils'

import ServerBoundPacketBuffer from './util/ServerBoundPacketBuffer'
import Client from './client/client'
import ServerBoundPacketHandler from './packets/ServerBoundPacketHandler'
import { UUIDResolvable } from './util/UUID'
import Player from './client/Player'
import RollingArray from './util/RollingArray'
import MathUtils from './util/MathUtils'
import S2CKeepAlivePacket from './packets/play/S2CKeepAlivePacket'

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

    private static readonly MAX_TPS = 4
    private static readonly MAX_MSPT = 1000 / MinecraftServer.MAX_TPS

    private readonly TICK_HISTORY = new RollingArray<Tick>(
        MinecraftServer.MAX_TPS * 60 /* Store at most the last 1 minute of tick history */
    )

    private readonly tcpServer: net.Server
    clients: Map<string, Client>
    packetHandler: ServerBoundPacketHandler

    constructor() {
        this.tcpServer = net.createServer()
        this.clients = new Map()
        this.packetHandler = new ServerBoundPacketHandler()
        this.init()
    }

    init() {
        this.tcpServer.on('connection', conn => {
            const remoteAddress = conn.remoteAddress + ':' + conn.remotePort

            console.log(chalk.magentaBright('New client connection from:'), remoteAddress)

            const client = new Client(conn)
            this.clients.set(remoteAddress, client)

            conn.on('data', buff => {
                const packetBuffs = ServerBoundPacketBuffer.fromRawBuffer(buff)

                for (let packetBuffer of packetBuffs) {
                    this.packetHandler.handle(client, packetBuffer)
                }
            })

            conn.once('close', () => {
                console.log(chalk.yellow(`Connection from ${remoteAddress} closed`))
                this.clients.delete(remoteAddress)
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
            // If client has not responded for over 30 seconds, disconnect them
            if (client.waitingForKeepAlive && client.lastKeepAliveReceived.getTime() < Date.now() - 1000 * 30) {
                client.disconnect('Keepalive timeout')
                continue
            }

            // Send keepalive packets every 10 seconds
            if (!client.waitingForKeepAlive && client.lastKeepAliveReceived.getTime() < Date.now() - 1000 * 10) {
                const id = Math.floor(Math.random() * 0xffff)

                client.lastKeepAliveIdSent = id
                client.waitingForKeepAlive = true
                client.sendPacket(new S2CKeepAlivePacket(id))
            }
        }

        // // Overrun tick to test
        // await new Promise(resolve => setTimeout(resolve, 25))
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
}
