import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'

export default class C2SPlayerRotationPacket extends C2SPacket {
    yaw: number
    pitch: number
    onGround: boolean
    
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        
        this.yaw = packetBuffer.readFloat()
        this.pitch = packetBuffer.readFloat()
        this.onGround = packetBuffer.readBoolean()
    }
}