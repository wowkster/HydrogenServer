import Client, { ConnectionState } from '../client/client'
import C2SLoginStartPacket from './login/C2SLoginStartPacket'
import PacketHandler from './PacketHandler'
import C2SEncryptionResponsePacket from './login/C2SEncryptionResponsePacket'
import C2SPluginResponsePacket from './login/C2SPluginResponsePacket'
import { NIL } from 'uuid'
import S2CLoginSuccessPacket from './login/S2CLoginSuccessPacket'
import S2CJoinGamePacket from './play/S2CJoinGamePacket'
import S2CPluginMessagePacket from './play/S2CPluginMessagePacket'
import { Difficulty } from '../util/PlayEnums'
import S2CServerDifficultyPacket from './play/S2CServerDifficultyPacket'
import S2CPlayerAbilitiesPacket from './play/S2CPlayerAbilitiesPacket'
import PlayerAbilities, { PlayerAbilityFlags } from '../client/play/PlayerAbilities'
import S2CHeldItemChangePacket from './play/S2CHeldItemChangePacket'
import S2CDeclareRecipesPacket from './play/S2CDeclareRecipesPacket'
import S2CTagsPacket from './play/S2CTagsPacket'
import S2CEntityStatusPacket from './play/S2CEntityStatusPacket'
import { EntityStatus } from './play/S2CEntityStatusPacket'
import { UnlockRecipesAction } from './play/S2CUnlockRecipesPacket'
import S2CUnlockRecipesPacket from './play/S2CUnlockRecipesPacket'
import S2CPlayerPositionAndLookPacket from './play/S2CPlayerPositionAndLookPacket'
import Player from '../client/Player'
import Position from '../util/Position'
import S2CPlayerInfoPacket from './play/S2CPlayerInfoPacket';
import { PlayerInfoAction } from './play/S2CPlayerInfoPacket';
import S2CUpdateViewPositionPacket from './play/S2CUpdateViewPositionPacket';
import S2CInitializeWorldBorderPacket from './play/S2CInitializeWorldBorderPacket';
import S2CSpawnPositionPacket from './play/S2CSpawnPositionPacket';
import Vector from '../util/Vector'

export default class LoginPacketHandler extends PacketHandler {
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
        this.player = new Player(NIL, packet.username, this)

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
        // TODO Chunk Data

        this.sendPacket(new S2CInitializeWorldBorderPacket())

        this.sendPacket(new S2CSpawnPositionPacket(new Vector(0, 0, 0), 0))

        this.sendPacket(new S2CUpdateViewPositionPacket(this.player.chunkX, this.player.chunkZ))

        this.sendPacket(S2CPlayerPositionAndLookPacket.fromPosition(new Position()))
    }

    private onEncryptionResponse(this: Client, packet: C2SEncryptionResponsePacket) {
        // TODO
    }

    private onPluginResponse(this: Client, packet: C2SPluginResponsePacket) {
        // TODO
    }
}
