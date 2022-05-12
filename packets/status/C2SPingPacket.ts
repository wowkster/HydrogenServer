import ServerBoundPacketBuffer from "../../util/ServerBoundPacketBuffer";
import C2SPacket from '../C2SPacket';

export default class C2SPingPacket extends C2SPacket {
    payload: bigint

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)
        this.payload = packetBuffer.readLong()
    }
}
