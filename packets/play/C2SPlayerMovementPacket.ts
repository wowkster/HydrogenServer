import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'

export default class C2SPlayerMovementPacket extends C2SPacket {
    onGround: boolean
    
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        
        this.onGround = packetBuffer.readBoolean()
    }
}