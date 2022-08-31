import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'
import Identifier from '../../util/Identifier'

export default class C2SPluginMessagePacket extends C2SPacket {
    channel: Identifier
    data: ServerBoundPacketBuffer

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.channel = packetBuffer.readIdentifier()
        this.data = packetBuffer.readEncodedBuffer()
    }
}
