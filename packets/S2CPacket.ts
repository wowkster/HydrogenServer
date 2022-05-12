import ClientBoundPacketBuffer from "../util/ClientBoundPacketBuffer"

export default abstract class S2CPacket {
    packetBuffer: ClientBoundPacketBuffer
    
    constructor(packetId: number) {
        this.packetBuffer = new ClientBoundPacketBuffer(packetId)
    }

    serialize(): Buffer {
        return this.packetBuffer.serialize()
    }
}