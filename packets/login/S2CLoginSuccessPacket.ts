import S2CPacket from '../S2CPacket'
import { UUIDResolvable } from '../../util/UUID'

export default class S2CLoginSuccessPacket extends S2CPacket {
    constructor(readonly uuid: UUIDResolvable, readonly username: string) {
        super(0x02)
        
        this.packetBuffer.writeUUID(uuid)
        this.packetBuffer.writeString(username)
    }
}
