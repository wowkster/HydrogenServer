import Client from '../../client/Client'
import { ChatComponent } from '../../datatypes/Chat'
import { GameMode } from '../../datatypes/PlayEnums'
import UUID from '../../datatypes/UUID'
import S2CPlayerInfoPacket, { PlayerInfoAction } from '../../network/packets/play/S2CPlayerInfoPacket'
import { EntityType } from '../EntityType'
import LivingEntity from '../LivingEntity'
import PlayerAbilities, { PlayerAbilityFlags } from './PlayerAbilities'
import PlayerInfo from './PlayerInfo'
import S2CSpawnPlayerPacket from '../../network/packets/play/S2CSpawnPlayerPacket';

export default class Player extends LivingEntity {
    
    readonly client: Client

    readonly playerInfo: PlayerInfo
    abilities: PlayerAbilities

    constructor(uuid: UUID, username: string, client: Client) {
        super(EntityType.PLAYER, uuid)

        this.playerInfo = new PlayerInfo(uuid, username)
        this.abilities = new PlayerAbilities([PlayerAbilityFlags.ALLOW_FLYING, PlayerAbilityFlags.FLYING])

        this.client = client
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

    getMaxHealth(): number {
       return 20
    }

    onDisconnect() {
        this.world.removeEntity(this)
    }

    getEntitiesInViewableRange() {
        return this.world.getEntitiesInViewableRangeOfPlayer(this).filter(e => e !== this)
    }

    createSpawnPacket() {
        return S2CSpawnPlayerPacket.fromPlayer(this)
    }
}
