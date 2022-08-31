import S2CPacket from '../S2CPacket'

export default class S2CPongPacket extends S2CPacket {
    constructor(readonly payload: bigint) {
        super(0x01)
        this.packetBuffer.writeLong(payload)
    }
}
