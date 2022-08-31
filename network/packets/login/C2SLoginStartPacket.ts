import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2SLoginStartPacket extends C2SPacket {
    username: string

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        this.username = packetBuffer.readString(16)
    }
}
