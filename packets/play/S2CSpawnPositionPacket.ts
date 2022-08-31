import S2CPacket from '../S2CPacket'
import Vector from '../../util/Vector';

export default class S2CSpawnPositionPacket extends S2CPacket {
    constructor(readonly pos: Vector, readonly angle: number) {
        super(0x4B)
        
        this.writePosition(pos)
        this.writeFloat(angle)
    }
}