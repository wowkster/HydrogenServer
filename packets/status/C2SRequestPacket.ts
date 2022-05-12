import ServerBoundPacketBuffer from "../../util/ServerBoundPacketBuffer";
import C2SPacket from '../C2SPacket';

export default class C2SRequestPacket extends C2SPacket {
    
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
    }
}