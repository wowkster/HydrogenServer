import Client, { ConnectionState } from '../../client/Client'
import C2SHandshakePacket from '../packets/handshake/C2SHandshakePacket'
import AbstractPacketHandler from './AbstractPacketHandler'
import StatusPacketHandler from './StatusPacketHandler'
import MinecraftServer from '../../index'
import LoginPacketHandler from './LoginPacketHandler'
import S2CLoginDisconnectPacket from '../packets/login/S2CLoginDisconnectPacket'

export default class HandshakePacketHandler extends AbstractPacketHandler {
    init() {
        this.packetMap = new Map([[0x00, [C2SHandshakePacket, this.onHandshake]]])
    }

    private onHandshake(packet: C2SHandshakePacket) {
        const { nextState, protoVersion, serverAddress, serverPort } = packet

        // Connection Information
        this.client.protoVersion = protoVersion
        this.client.serverAddress = serverAddress
        this.client.serverPort = serverPort

        // Switches connection into either Status or Login state
        switch (nextState) {
            case ConnectionState.STATUS: {
                this.client.state = ConnectionState.STATUS
                this.client.packetHandler = new StatusPacketHandler(this.client)
                break
            }
            case ConnectionState.LOGIN: {
                this.client.state = ConnectionState.LOGIN

                // Disconnect the client if the proto version does not match
                if (packet.protoVersion != MinecraftServer.PROTO_VERSION) {
                    this.disconnect(
                        packet.protoVersion < MinecraftServer.PROTO_VERSION
                            ? `Client outdated! This server runs on version ${MinecraftServer.MC_VERSION}`
                            : `Client incompatible! This server runs on version ${MinecraftServer.MC_VERSION}`
                    )
                }

                this.client.packetHandler = new LoginPacketHandler(this.client)
                break
            }
            default: {
                throw new Error(`Unsupported handshake intention: ${nextState}`)
            }
        }
    }
}
