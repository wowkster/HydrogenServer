import chalk from 'chalk'

import Client from '../client/Client'
import ServerBoundPacketBuffer from './ServerBoundPacketBuffer'

import { UnknownPacketError } from './handlers/AbstractPacketHandler'

export default class ServerBoundPacketManager {
    constructor() {
        // TODO Implement packet queue and ticking
    }

    handle(client: Client, packetBuffer: ServerBoundPacketBuffer) {
        try {
            client.packetHandler.handle(packetBuffer)
        } catch (err) {
            if (!(err instanceof UnknownPacketError)) throw err

            console.log(
                chalk.yellow('Caught Unknown Packet'),
                chalk.gray(`(0x${err.packetBuffer.packetID.toString(16)}):`),
                err.packetBuffer
            )
        }
    }
}
