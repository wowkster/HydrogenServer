import Identifier from '../../../datatypes/Identifier'
import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2SPluginMessagePacket extends C2SPacket {
    channel: Identifier
    data: ServerBoundPacketBuffer

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.channel = packetBuffer.readIdentifier()
        this.data = packetBuffer.readEncodedBuffer()
    }
}
