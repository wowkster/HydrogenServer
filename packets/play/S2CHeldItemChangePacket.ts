import S2CPacket from '../S2CPacket'

export default class S2CHeldItemChangePacket extends S2CPacket {
    /**
     * @param slot Hotbar slot (0-8)
     */
    constructor(slot: number) {
        super(0x48)
        this.packetBuffer.writeByte(slot)
    }
}