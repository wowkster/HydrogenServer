import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'

export default class C2SKeepAlivePacket extends C2SPacket {
    keepAliveId: number

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.keepAliveId = Number(packetBuffer.readLong())
    }
}
