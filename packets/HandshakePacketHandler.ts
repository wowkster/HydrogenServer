import Client from '../client/client'
import PacketHandler from './PacketHandler'
import C2SHandshakePacket from './handshake/C2SHandshakePacket'

export default class HandshakePacketHandler extends PacketHandler {
    init() {
        this.packetMap = new Map([[0x00, [C2SHandshakePacket, this.onHandshake]]])
    }

    private onHandshake(this: Client, packet: C2SHandshakePacket) {
        // Send SPL JSON response
        const { nextState, protoVersion, serverAddress, serverPort } = packet

        // Switches connection into either Status or Login state
        this.state = nextState

        // Connection Information
        this.protoVersion = protoVersion
        this.serverAddress = serverAddress
        this.serverPort = serverPort
    }
}
