import Client, { ConnectionState } from '../../client/Client'
import Player from '../../client/Player'
import { Difficulty } from '../../datatypes/PlayEnums'
import Position from '../../datatypes/Position'
import Vector from '../../datatypes/Vector'
import UUID from '../../datatypes/UUID'

import C2SEncryptionResponsePacket from '../packets/login/C2SEncryptionResponsePacket'
import C2SLoginStartPacket from '../packets/login/C2SLoginStartPacket'
import C2SPluginResponsePacket from '../packets/login/C2SPluginResponsePacket'
import S2CLoginSuccessPacket from '../packets/login/S2CLoginSuccessPacket'
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

export default class LoginPacketHandler extends AbstractPacketHandler {
    init() {
        this.packetMap = new Map([
            [0x00, [C2SLoginStartPacket, this.onLoginStart]],
            [0x01, [C2SEncryptionResponsePacket, this.onEncryptionResponse]],
            [0x02, [C2SPluginResponsePacket, this.onPluginResponse]],
        ])
    }

    private onLoginStart(this: Client, packet: C2SLoginStartPacket) {
        // TODO Add compression and encryption

        // Skip all the other login steps and send login success
        this.player = new Player(UUID.ZERO, packet.username, this)

        this.sendPacket(new S2CLoginSuccessPacket(this.player.uuid, this.player.username))

        // Switch state to PLAY and send initial game packets
        this.state = ConnectionState.PLAY

        this.sendPacket(new S2CJoinGamePacket(this.player.entityID))

        this.sendPacket(S2CPluginMessagePacket.BRAND_PACKET)

        this.sendPacket(new S2CServerDifficultyPacket(Difficulty.EASY, true))

        this.sendPacket(new S2CPlayerAbilitiesPacket(this.player.abilities))

        this.sendPacket(new S2CHeldItemChangePacket(0))

        this.sendPacket(new S2CDeclareRecipesPacket())

        this.sendPacket(new S2CTagsPacket())

        this.sendPacket(new S2CEntityStatusPacket(this.player.entityID, EntityStatus.PLAYER_OP_0))

        // TODO Declare Commands

        this.sendPacket(new S2CUnlockRecipesPacket(UnlockRecipesAction.INIT))

        this.sendPacket(S2CPlayerPositionAndLookPacket.fromPosition(new Position()))

        this.sendPacket(new S2CPlayerInfoPacket(PlayerInfoAction.ADD_PLAYER, [this.player.playerInfo]))
        this.sendPacket(new S2CPlayerInfoPacket(PlayerInfoAction.UPDATE_LATENCY, [this.player.playerInfo]))

        this.sendPacket(new S2CUpdateViewPositionPacket(this.player.chunkX, this.player.chunkZ))

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

        this.sendPacket(new S2CSpawnPositionPacket(new Vector(0, 0, 0), 0))

        this.sendPacket(new S2CUpdateViewPositionPacket(this.player.chunkX, this.player.chunkZ))

        this.sendPacket(S2CPlayerPositionAndLookPacket.fromPosition(Position.ORIGIN))
    }

    private onEncryptionResponse(this: Client, packet: C2SEncryptionResponsePacket) {
        // TODO
    }

    private onPluginResponse(this: Client, packet: C2SPluginResponsePacket) {
        // TODO
    }
}
