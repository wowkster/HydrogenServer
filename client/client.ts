import { Socket } from "net"
import S2CPacket from "../packets/S2CPacket"
import { UUID } from '../util/UUID';
import PlayerAbilities from './play/PlayerAbilities';
import { ClientSettings } from './play/ClientSettings';

export enum ConnectionState {
    HANDSHAKE = 0,
    STATUS = 1,
    LOGIN = 2, 
    PLAY = 3
}

export default class Client {
    state: ConnectionState
    conn: Socket
    uuid?: UUID
    username?: string
    brand?: string
    settings?: ClientSettings

    abilities: PlayerAbilities

    constructor(conn: Socket) {
        this.conn = conn
        
        this.state = ConnectionState.HANDSHAKE
        this.abilities = new PlayerAbilities()
    }

    sendPacket(packet: S2CPacket) {
        this.conn.write(packet.serialize())
    }
}