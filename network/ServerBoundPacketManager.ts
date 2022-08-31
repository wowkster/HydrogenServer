import chalk from 'chalk'

import Client, { ConnectionState } from '../client/Client'
import ServerBoundPacketBuffer from './ServerBoundPacketBuffer'

import { UnknownPacketError } from './handlers/AbstractPacketHandler'
import HandshakePacketHandler from './handlers/HandshakePacketHandler'
import LoginPacketHandler from './handlers/LoginPacketHandler'
import PlayPacketHandler from './handlers/PlayPacketHandler'
import StatusPacketHandler from './handlers/StatusPacketHandler'

export default class ServerBoundPacketManager {
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
