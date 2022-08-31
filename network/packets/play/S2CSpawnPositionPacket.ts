import Vector from '../../../datatypes/Vector'
import S2CPacket from '../S2CPacket'

export default class S2CSpawnPositionPacket extends S2CPacket {
    constructor(readonly pos: Vector, readonly angle: number) {
        super(0x4b)

        this.writePosition(pos)
        this.writeFloat(angle)
    }
}
