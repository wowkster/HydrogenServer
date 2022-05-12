import S2CPacket from '../S2CPacket'
import { UUID } from '../../util/UUID'

export default class S2CLoginSuccessPacket extends S2CPacket {
    constructor(uuid: UUID, username: string) {
        super(0x02)
        
        this.packetBuffer.writeUUID(uuid)
        this.packetBuffer.writeString(username)
    }
}
