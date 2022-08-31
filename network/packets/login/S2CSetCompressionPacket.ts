import S2CPacket from '../S2CPacket'

export default class S2CSetCompressionPacket extends S2CPacket {
    constructor(threshold: number) {
        super(0x03)
        this.packetBuffer.writeVarInt(threshold)
    }
}
