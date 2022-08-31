import { Difficulty } from '../../util/PlayEnums';
import S2CPacket from '../S2CPacket';

export default class S2CServerDifficultyPacket extends S2CPacket {
    constructor(readonly difficulty: Difficulty, readonly locked: boolean) {
        super(0x0E)

        this.packetBuffer.writeUnsignedByte(difficulty)
        this.packetBuffer.writeBoolean(locked)
    }
}