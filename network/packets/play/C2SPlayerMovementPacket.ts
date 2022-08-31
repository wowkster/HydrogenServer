import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2SPlayerMovementPacket extends C2SPacket {
    onGround: boolean

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.onGround = packetBuffer.readBoolean()
    }
}
