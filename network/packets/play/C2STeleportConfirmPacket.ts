import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2STeleportConfirmPacket extends C2SPacket {
    teleportID: number

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        this.teleportID = packetBuffer.readVarInt()
    }
}
