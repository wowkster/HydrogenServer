import S2CPacket from '../S2CPacket'

/**
 * https://wiki.vg/Protocol#Declare_Recipes
 */
export default class S2CDeclareRecipesPacket extends S2CPacket {
    constructor() {
        super(0x66)

        this.packetBuffer.writeVarInt(0) // Num Recipes (0 for now)

        // TODO Add recipes here
    }
}
