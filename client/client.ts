import { Socket } from "net"
import S2CPacket from "../packets/S2CPacket"
import { UUIDResolvable } from '../util/UUID';
import PlayerAbilities from './play/PlayerAbilities';
import { ClientSettings } from './play/ClientSettings';
import chalk from "chalk";
import PlayerInfo from './play/PlayerInfo';
import Player from './Player';

export enum ConnectionState {
    HANDSHAKE = 0,
    STATUS = 1,
    LOGIN = 2, 
    PLAY = 3
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

    lastKeepAliveIdSent: number = 0
    lastKeepAliveReceived?: Date

    constructor(conn: Socket) {
        this.conn = conn
        this.state = ConnectionState.HANDSHAKE
    }

    sendPacket(packet: S2CPacket) {
        console.log(chalk.red('S2C Packet:'), packet)
        this.conn.write(packet.serialize())
    }
}