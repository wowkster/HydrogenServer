import S2CPacket from '../S2CPacket'

/**
 * https://wiki.vg/Protocol#Tags
 */
export default class S2CTagsPacket extends S2CPacket {
    constructor() {
        super(0x67)

        this.packetBuffer.writeVarInt(0) // Num Tags (0 for now)

        // TODO Add tags here
    }
}
