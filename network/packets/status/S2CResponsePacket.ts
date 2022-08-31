import { ChatComponent } from '../../../datatypes/Chat'
import S2CPacket from '../S2CPacket'

export interface PingResponse {
    version: {
        name: string
        protocol: number
    }
    players: {
        max: number
        online: number
        sample: {
            name: string
            id: string
        }[]
    }
    description: ChatComponent
    favicon?: string
}

export default class S2CResponsePacket extends S2CPacket {
    constructor(response: PingResponse) {
        super(0x00)
        this.packetBuffer.writeJSON(response)
    }
}
