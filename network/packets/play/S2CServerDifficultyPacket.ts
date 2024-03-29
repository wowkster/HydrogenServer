import { Difficulty } from '../../../datatypes/PlayEnums'
import S2CPacket from '../S2CPacket'

export default class S2CServerDifficultyPacket extends S2CPacket {
    constructor(readonly difficulty: Difficulty, readonly locked: boolean) {
        super(0x0e)

        this.packetBuffer.writeUnsignedByte(difficulty)
        this.packetBuffer.writeBoolean(locked)
    }
}
