import S2CPacket from '../S2CPacket'

export default class S2CSpawnExperienceOrbPacket extends S2CPacket {
    constructor(
        readonly entityId: number,
        readonly x: number,
        readonly y: number,
        readonly z: number,
        readonly count: number
    ) {
        super(0x01)

        this.packetBuffer.writeVarInt(entityId)
        this.packetBuffer.writeDouble(x)
        this.packetBuffer.writeDouble(y)
        this.packetBuffer.writeDouble(z)
        this.packetBuffer.writeShort(count)
    }
}
