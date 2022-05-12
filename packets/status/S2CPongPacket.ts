import S2CPacket from '../S2CPacket';

export default class S2CPongPacket extends S2CPacket {
    constructor(payload: bigint) {
        super(0x01)
        this.packetBuffer.writeLong(payload)
    }
}