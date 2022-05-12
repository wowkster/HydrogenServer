import S2CPacket from '../S2CPacket'
import PlayerAbilities from '../../client/play/PlayerAbilities';

export default class S2CPlayerAbilitiesPacket extends S2CPacket {
    constructor(flags: PlayerAbilities, flySpeed = 0.05, fovModifier = 0.1) {
        super(0x32)

        this.packetBuffer.writeByte(flags.serialize())
        this.packetBuffer.writeFloat(flySpeed)
        this.packetBuffer.writeFloat(fovModifier)
    }
}
