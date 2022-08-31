import { Socket } from 'net'
import S2CPacket from '../network/packets/S2CPacket'
import { ClientSettings } from '../datatypes/client/ClientSettings'
import chalk from 'chalk'
import Player from './Player'
import S2CPlayDisconnectPacket from '../network/packets/play/S2CPlayDisconnectPacket'

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
    state: ConnectionState
    protoVersion?: number
    serverAddress?: string
    serverPort?: number

    // Client Data
    brand?: string
    settings?: ClientSettings

    // Player
    player?: Player

    // Keep Alive
    waitingForKeepAlive: boolean
    lastKeepAliveIdSent: number
    lastKeepAliveReceived: Date

    constructor(conn: Socket) {
        this.conn = conn
        this.state = ConnectionState.HANDSHAKE

        this.waitingForKeepAlive = false
        this.lastKeepAliveIdSent = 0
        this.lastKeepAliveReceived = new Date()
    }

    sendPacket(packet: S2CPacket) {
        console.log(chalk.red('S2C Packet:'), packet)
        this.conn.write(packet.serialize())
    }

    disconnect(reason: string) {
        this.sendPacket(
            new S2CPlayDisconnectPacket({
                text: reason,
            })
        )
        this.conn.destroy()
    }
}
