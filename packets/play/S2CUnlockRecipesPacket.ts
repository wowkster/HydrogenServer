import S2CPacket from '../S2CPacket'

export enum UnlockRecipesAction {
    INIT = 0,
    ADD = 1,
    REMOVE = 2,
}

/**
 * https://wiki.vg/Protocol#Unlock_Recipes
 */
export default class S2CUnlockRecipesPacket extends S2CPacket {
    constructor(action: UnlockRecipesAction) {
        super(0x39)

        // TODO Add Recipes

        this.packetBuffer.writeVarInt(action) // Action
        this.packetBuffer.writeBoolean(false) // Crafting Recipe Book Open
        this.packetBuffer.writeBoolean(false) // Crafting Recipe Book Filter Active
        this.packetBuffer.writeBoolean(false) // Smelting Recipe Book Open
        this.packetBuffer.writeBoolean(false) // Smelting Recipe Book Filter Active
        this.packetBuffer.writeBoolean(false) // Blast Furnace Recipe Book Open
        this.packetBuffer.writeBoolean(false) // Blast Furnace Recipe Book Filter Active
        this.packetBuffer.writeBoolean(false) // Smoker Recipe Book Open
        this.packetBuffer.writeBoolean(false) // Smoker Recipe Book Filter Active

        this.packetBuffer.writeVarInt(0) // Recipe IDs (1) Size
        this.packetBuffer.writeVarInt(0) // Recipe IDs (1) Size
    }
}
