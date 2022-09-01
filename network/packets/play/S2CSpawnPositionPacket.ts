import BlockPos from '../../../datatypes/BlockPos';
import S2CPacket from '../S2CPacket';

export default class S2CSpawnPositionPacket extends S2CPacket {
    constructor(readonly pos: BlockPos, readonly angle: number) {
        super(0x4b)

        this.writeBlockPos(pos)
        this.writeFloat(angle)
    }
}
