import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'

/**
 * https://wiki.vg/Protocol#Player_Position
 */
export default class C2SPlayerPositionPacket extends C2SPacket {
    x: number
    y: number
    z: number
    onGround: boolean
    
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        
        this.x = packetBuffer.readDouble()
        this.y = packetBuffer.readDouble()
        this.z = packetBuffer.readDouble()
        this.onGround = packetBuffer.readBoolean()
    }
}