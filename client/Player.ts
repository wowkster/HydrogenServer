import { UUIDResolvable } from '../util/UUID'
import PlayerInfo from './play/PlayerInfo'
import PlayerAbilities, { PlayerAbilityFlags } from './play/PlayerAbilities'
import Vector from '../util/Vector'
import { GameMode } from '../util/PlayEnums'
import S2CPlayerInfoPacket from '../packets/play/S2CPlayerInfoPacket'
import { PlayerInfoAction } from '../packets/play/S2CPlayerInfoPacket'
import { ChatComponent } from '../util/Chat'
import Client from './client'

export default class Player {
    readonly client: Client

    readonly playerInfo: PlayerInfo
    abilities: PlayerAbilities
    entityID: number = 0

    position: Vector
    yaw: number
    pitch: number

    velocity: Vector
    acceleration: Vector

    constructor(uuid: UUIDResolvable, username: string, client: Client) {
        this.playerInfo = new PlayerInfo(uuid, username)
        this.abilities = new PlayerAbilities([PlayerAbilityFlags.ALLOW_FLYING, PlayerAbilityFlags.FLYING])

        this.position = new Vector()
        this.velocity = new Vector()
        this.acceleration = new Vector()

        this.yaw = 0
        this.pitch = 0

        this.client = client
    }

    get uuid() {
        return this.playerInfo.uuid
    }

    get username() {
        return this.playerInfo.username
    }

    get gameMode() {
        return this.playerInfo.gameMode
    }

    set gameMode(gameMode: GameMode) {
        this.playerInfo.gameMode = gameMode
        this.client.sendPacket(new S2CPlayerInfoPacket(PlayerInfoAction.UPDATE_GAME_MODE, [this.playerInfo]))
    }

    set displayName(displayName: ChatComponent | null) {
        if (displayName) {
            this.playerInfo.displayName = displayName
            this.playerInfo.hasDisplayName = true
        } else {
            this.playerInfo.displayName = null
            this.playerInfo.hasDisplayName = false
        }

        this.client.sendPacket(new S2CPlayerInfoPacket(PlayerInfoAction.UPDATE_DISPLAY_NAME, [this.playerInfo]))
    }

    get x() {
        return this.position.x
    }

    get blockX() {
        return Math.floor(this.position.x)
    }

    get chunkX() {
        return Math.floor(this.x / 16)
    }

    get y() {
        return this.position.y
    }

    get blockY() {
        return Math.floor(this.position.y)
    }

    get z() {
        return this.position.z
    }

    get blockZ() {
        return Math.floor(this.position.z)
    }

    get chunkZ() {
        return Math.floor(this.z / 16)
    }
}
