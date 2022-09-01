import Client, { ConnectionState } from '../../client/Client'
import { Difficulty } from '../../datatypes/PlayEnums'
import UUID from '../../datatypes/UUID'
import Vector from '../../datatypes/Vector'
import Player from '../../entity/player/Player'

import MinecraftServer from '../..'
import World from '../../world/World'
import C2SEncryptionResponsePacket from '../packets/login/C2SEncryptionResponsePacket'
import C2SLoginStartPacket from '../packets/login/C2SLoginStartPacket'
import C2SPluginResponsePacket from '../packets/login/C2SPluginResponsePacket'
import S2CLoginSuccessPacket from '../packets/login/S2CLoginSuccessPacket'
import S2CSetCompressionPacket from '../packets/login/S2CSetCompressionPacket'
import S2CChunkDataAndUpdateLightPacket from '../packets/play/S2CChunkDataAndUpdateLightPacket'
import S2CDeclareRecipesPacket from '../packets/play/S2CDeclareRecipesPacket'
import S2CEntityStatusPacket, { EntityStatus } from '../packets/play/S2CEntityStatusPacket'
import S2CHeldItemChangePacket from '../packets/play/S2CHeldItemChangePacket'
import S2CInitializeWorldBorderPacket from '../packets/play/S2CInitializeWorldBorderPacket'
import S2CJoinGamePacket from '../packets/play/S2CJoinGamePacket'
import S2CPlayerAbilitiesPacket from '../packets/play/S2CPlayerAbilitiesPacket'
import S2CPlayerInfoPacket, { PlayerInfoAction } from '../packets/play/S2CPlayerInfoPacket'
import S2CPlayerPositionAndLookPacket from '../packets/play/S2CPlayerPositionAndLookPacket'
import S2CPluginMessagePacket from '../packets/play/S2CPluginMessagePacket'
import S2CServerDifficultyPacket from '../packets/play/S2CServerDifficultyPacket'
import S2CSpawnPositionPacket from '../packets/play/S2CSpawnPositionPacket'
import S2CTagsPacket from '../packets/play/S2CTagsPacket'
import S2CUnlockRecipesPacket, { UnlockRecipesAction } from '../packets/play/S2CUnlockRecipesPacket'
import S2CUpdateViewPositionPacket from '../packets/play/S2CUpdateViewPositionPacket'
import AbstractPacketHandler from './AbstractPacketHandler'
import BlockPos from '../../datatypes/BlockPos';

export default class LoginPacketHandler extends AbstractPacketHandler {
    init() {
        this.packetMap = new Map([
            [0x00, [C2SLoginStartPacket, this.onLoginStart]],
            [0x01, [C2SEncryptionResponsePacket, this.onEncryptionResponse]],
            [0x02, [C2SPluginResponsePacket, this.onPluginResponse]],
        ])
    }

    private onLoginStart(this: Client, packet: C2SLoginStartPacket) {
        // TODO Add encryption

        // Enable packet compression
        this.sendPacket(new S2CSetCompressionPacket(MinecraftServer.PACKET_COMPRESSION_THRESHOLD))
        this.compressionEnabled = true

        // Skip all the other login steps and send login success
        this.player = new Player(UUID.ZERO, packet.username, this)

        this.sendPacket(new S2CLoginSuccessPacket(this.player.uuid, this.player.username))

        // Switch state to PLAY and send initial game packets
        this.state = ConnectionState.PLAY

        this.sendPacket(new S2CJoinGamePacket(this.player.id))

        this.sendPacket(S2CPluginMessagePacket.BRAND_PACKET)

        this.sendPacket(new S2CServerDifficultyPacket(Difficulty.EASY, true))

        this.sendPacket(new S2CPlayerAbilitiesPacket(this.player.abilities))

        this.sendPacket(new S2CHeldItemChangePacket(0))

        this.sendPacket(new S2CDeclareRecipesPacket())

        this.sendPacket(new S2CTagsPacket())

        this.sendPacket(new S2CEntityStatusPacket(this.player.id, EntityStatus.PLAYER_OP_0))

        // TODO Declare Commands

        this.sendPacket(new S2CUnlockRecipesPacket(UnlockRecipesAction.INIT))

        this.sendPacket(S2CPlayerPositionAndLookPacket.fromPosition(this.player.position))

        // Send player info to all clients
        MinecraftServer.INSTANCE.emitPacketToAllPlayers(
            new S2CPlayerInfoPacket(PlayerInfoAction.ADD_PLAYER, [this.player.playerInfo])
        )
        MinecraftServer.INSTANCE.emitPacketToAllPlayers(
            new S2CPlayerInfoPacket(PlayerInfoAction.UPDATE_LATENCY, [this.player.playerInfo])
        )
        MinecraftServer.INSTANCE.emitPacketToAllPlayers(
            new S2CPlayerInfoPacket(PlayerInfoAction.UPDATE_GAME_MODE, [this.player.playerInfo])
        )

        // Add player to world and tell other clients that need to know
        World.OVERWORLD.addEntity(this.player)

        this.sendPacket(
            new S2CUpdateViewPositionPacket(this.player.position.asChunkPos().x, this.player.position.asChunkPos().z)
        )

        // TODO Update Light

        for (let x = -4; x < 4; x++) {
            for (let z = -4; z < 4; z++) {
                this.sendPacket(
                    new S2CChunkDataAndUpdateLightPacket(
                        x,
                        z,
                        S2CChunkDataAndUpdateLightPacket.EMPTY_CHUNK_DATA,
                        S2CChunkDataAndUpdateLightPacket.EMPTY_LIGHT_DATA
                    )
                )
            }
        }

        this.sendPacket(new S2CInitializeWorldBorderPacket())

        // TODO implement spawn position (for now it is always the origin)
        this.sendPacket(new S2CSpawnPositionPacket(BlockPos.ZERO, 0))

        this.sendPacket(S2CPlayerPositionAndLookPacket.fromPosition(this.player.position))

        // TODO Wait for teleport confirm before sending more packets

        // Send all the entities in range of the player
        for (const entity of this.player.getEntitiesInViewableRange()) {
            this.sendPacket(entity.createSpawnPacket())
        }

        // TODO Send inventory
    }

    private onEncryptionResponse(this: Client, packet: C2SEncryptionResponsePacket) {
        // TODO
    }

    private onPluginResponse(this: Client, packet: C2SPluginResponsePacket) {
        // TODO
    }
}
