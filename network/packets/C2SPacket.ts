import ServerBoundPacketBuffer from '../ServerBoundPacketBuffer'

export default abstract class C2SPacket {
    constructor(packetBuffer: ServerBoundPacketBuffer) {}
}
