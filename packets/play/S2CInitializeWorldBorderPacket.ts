import S2CPacket from '../S2CPacket'

const DEFAULT_DIAMETER = 29999984

export default class S2CInitializeWorldBorderPacket extends S2CPacket {
    constructor(centerX = 0, centerZ = 0, oldDiameter = DEFAULT_DIAMETER, newDiameter = DEFAULT_DIAMETER, speed = 0n, portalTeleportBoundary = DEFAULT_DIAMETER, warningBlocks = 0, warningTime = 0) {
        super(0x20)
        
        this.writeDouble(centerX)
        this.writeDouble(centerZ)
        this.writeDouble(oldDiameter)
        this.writeDouble(newDiameter ?? oldDiameter)
        this.writeVarLong(speed)
        this.writeVarInt(portalTeleportBoundary)
        this.writeVarInt(warningBlocks)
        this.writeVarInt(warningTime)

    }
}