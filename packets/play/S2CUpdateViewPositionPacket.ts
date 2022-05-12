import S2CPacket from '../S2CPacket'

/**
 * https://wiki.vg/Protocol#Update_View_Position
 * This is where is sent: https://wiki.vg/Protocol#Chunk_Data_And_Update_Light
 */
export default class S2CUpdateViewPositionPacket extends S2CPacket {
    constructor(chunkX: number, chunkZ: number) {
        super(0x49)
        
        this.writeVarInt(chunkX)
        this.writeVarInt(chunkZ)
    }
}