import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'

export default class C2STeleportConfirmPacket extends C2SPacket {
    teleportID: number
    
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        this.teleportID = packetBuffer.readVarInt()
    }
}