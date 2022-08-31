import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'

export default class C2SPluginResponsePacket extends C2SPacket {
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        // TODO Add Plugins Response Packet
    }
}
