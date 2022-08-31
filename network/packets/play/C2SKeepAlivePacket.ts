import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2SKeepAlivePacket extends C2SPacket {
    keepAliveId: number

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.keepAliveId = Number(packetBuffer.readLong())
    }
}
