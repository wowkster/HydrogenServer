import UUID, { UUIDResolvable } from '../../datatypes/UUID'
import { ChatComponent } from '../Chat'
import { GameMode } from '../PlayEnums'

export interface Property {
    name: string
    value: string
    isSigned: boolean
    signature?: string
}

export default class PlayerInfo {
    readonly uuid: UUID
    readonly username: string
    properties: Property[]
    gameMode: GameMode = GameMode.SURVIVAL
    ping: number = 0
    hasDisplayName: boolean = false
    displayName: ChatComponent | null = null

    constructor(uuid: UUIDResolvable, username: string) {
        this.uuid = new UUID(uuid)
        this.username = username

        this.properties = []
    }
}
