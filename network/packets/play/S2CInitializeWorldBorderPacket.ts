import S2CPacket from '../S2CPacket'

const DEFAULT_DIAMETER = 29999984

export default class S2CInitializeWorldBorderPacket extends S2CPacket {
    constructor(
        readonly centerX = 0,
        readonly centerZ = 0,
        readonly oldDiameter = DEFAULT_DIAMETER,
        readonly newDiameter = DEFAULT_DIAMETER,
        readonly speed = 0n,
        readonly portalTeleportBoundary = DEFAULT_DIAMETER,
        readonly warningBlocks = 0,
        readonly warningTime = 0
    ) {
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
