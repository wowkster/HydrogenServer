import Client, { ConnectionState } from '../client/client'
import ServerBoundPacketBuffer from '../util/ServerBoundPacketBuffer'
import StatusPacketHandler from './StatusPacketHandler'
import LoginPacketHandler from './LoginPacketHandler'
import HandshakePacketHandler from './HandshakePacketHandler'
import PlayPacketHandler from './PlayPacketHandler'
import { UnknownPacketError } from './PacketHandler'
import chalk from 'chalk'
export default class ServerBoundPacketHandler {
    handshakePacketHandler: HandshakePacketHandler
    statusPacketHandler: StatusPacketHandler
    loginPacketHandler: LoginPacketHandler
    playPacketHandler: PlayPacketHandler

    constructor() {
        this.handshakePacketHandler = new HandshakePacketHandler()
        this.statusPacketHandler = new StatusPacketHandler()
        this.loginPacketHandler = new LoginPacketHandler()
        this.playPacketHandler = new PlayPacketHandler()
    }

    handle(client: Client, packetBuffer: ServerBoundPacketBuffer) {
        const { state } = client

        switch (state) {
            case ConnectionState.HANDSHAKE:
                this.handshakePacketHandler.handle(client, packetBuffer)
                break
            case ConnectionState.STATUS:
                this.statusPacketHandler.handle(client, packetBuffer)
                break
            case ConnectionState.LOGIN:
                this.loginPacketHandler.handle(client, packetBuffer)
                break
            case ConnectionState.PLAY:
                try {
                    this.playPacketHandler.handle(client, packetBuffer)
                } catch (err) {
                    if (!(err instanceof UnknownPacketError)) throw err

                    console.log(
                        chalk.yellow('Caught Unknown Packet'),
                        chalk.gray(`(0x${err.packetBuffer.packetID.toString(16)}):`),
                        err.packetBuffer
                    )
                }
                break
        }
    }
}
