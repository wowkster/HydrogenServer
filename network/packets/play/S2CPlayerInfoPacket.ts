import PlayerInfo from '../../../entity/player/PlayerInfo'
import S2CPacket from '../S2CPacket'

export enum PlayerInfoAction {
    ADD_PLAYER = 0,
    UPDATE_GAME_MODE = 1,
    UPDATE_LATENCY = 2,
    UPDATE_DISPLAY_NAME = 3,
    REMOVE_PLAYER = 4,
}

export default class S2CPlayerInfoPacket extends S2CPacket {
    constructor(readonly action: PlayerInfoAction, readonly players: PlayerInfo[]) {
        super(0x36)

        this.writeVarInt(action)
        this.writeVarInt(players.length)

        for (let player of players) {
            this.writeUUID(player.uuid)

            switch (action) {
                case PlayerInfoAction.ADD_PLAYER:
                    this.writeString(player.username, 16)
                    this.writeVarInt(player.properties.length)
                    for (let prop of player.properties) {
                        this.writeString(prop.name, 32767)
                        this.writeString(prop.value, 32767)
                        this.writeBoolean(prop.isSigned)
                        if (prop.isSigned) this.writeString(prop.signature!, 32767)
                    }
                    this.writeVarInt(player.gameMode)
                    this.writeVarInt(player.ping)
                    this.writeBoolean(player.hasDisplayName)
                    if (player.hasDisplayName) this.writeChat(player.displayName!)
                    break
                case PlayerInfoAction.UPDATE_GAME_MODE:
                    this.writeVarInt(player.gameMode)
                    break
                case PlayerInfoAction.UPDATE_LATENCY:
                    this.writeVarInt(player.ping)
                    break
                case PlayerInfoAction.UPDATE_DISPLAY_NAME:
                    this.writeBoolean(player.hasDisplayName)
                    if (player.hasDisplayName) this.writeChat(player.displayName!)
                    break
            }
        }
    }
}
