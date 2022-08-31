import { Socket } from 'net'
import S2CPacket from '../packets/S2CPacket'
import { ClientSettings } from './play/ClientSettings'
import chalk from 'chalk'
import Player from './Player'
import S2CPlayDisconnectPacket from '../packets/play/S2CPlayDisconnectPacket'

export enum ConnectionState {
    HANDSHAKE = 0,
    STATUS = 1,
    LOGIN = 2,
    PLAY = 3,
}

export default class Client {
    conn: Socket

    state: ConnectionState
    protoVersion?: number
    serverAddress?: string
    serverPort?: number

    brand?: string
    settings?: ClientSettings

    player?: Player

    waitingForKeepAlive: boolean = false
    lastKeepAliveIdSent: number = 0
    lastKeepAliveReceived: Date = new Date()

    constructor(conn: Socket) {
        this.conn = conn
        this.state = ConnectionState.HANDSHAKE
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
