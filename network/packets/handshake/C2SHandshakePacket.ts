import { ConnectionState } from '../../../client/Client'
import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2SHandshakePacket extends C2SPacket {
    protoVersion: number
    serverAddress: string
    serverPort: number
    nextState: ConnectionState

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.protoVersion = packetBuffer.readVarInt()
        this.serverAddress = packetBuffer.readString(255)
        this.serverPort = packetBuffer.readUnsignedShort()
        this.nextState = packetBuffer.readVarInt() as ConnectionState
    }
}
