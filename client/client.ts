import { Socket } from 'net'
import S2CPacket from '../network/packets/S2CPacket'
import { ClientSettings } from '../datatypes/client/ClientSettings'
import chalk from 'chalk'
import Player from '../entity/player/Player'
import S2CPlayDisconnectPacket from '../network/packets/play/S2CPlayDisconnectPacket'
import AbstractPacketHandler from '../network/handlers/AbstractPacketHandler'
import HandshakePacketHandler from '../network/handlers/HandshakePacketHandler'

export enum ConnectionState {
    HANDSHAKE = 0,
    STATUS = 1,
    LOGIN = 2,
    PLAY = 3,
}

export default class Client {
    // Raw TCP Socket
    conn: Socket

    // Connection
    packetHandler: AbstractPacketHandler
    state: ConnectionState
    protoVersion?: number
    serverAddress?: string
    serverPort?: number
    compressionEnabled: boolean

    // Client Data
    brand?: string
    settings?: ClientSettings

    // Player
    player?: Player

    constructor(conn: Socket) {
        this.conn = conn
        this.state = ConnectionState.HANDSHAKE
        this.packetHandler = new HandshakePacketHandler(this)

        this.compressionEnabled = false
    }

    sendPacket(packet: S2CPacket) {
        console.log(chalk.red('S2C Packet:'), packet)
        this.conn.write(packet.serialize(this.compressionEnabled))
    }
}
