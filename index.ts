import net from 'net'
import chalk from 'chalk'
import ServerBoundPacketBuffer from './util/ServerBoundPacketBuffer'
import Client from './client/client'
import ServerBoundPacketHandler from './packets/ServerBoundPacketHandler'
import { UUIDResolvable } from './util/UUID';
import Player from './client/Player'

export default class MinecraftServer {
    static readonly INSTANCE = new MinecraftServer()

    tcpServer: net.Server
    clients: Map<string, Client>
    packetHandler: ServerBoundPacketHandler

    constructor() {
        this.tcpServer = net.createServer()
        this.clients = new Map()
        this.packetHandler = new ServerBoundPacketHandler()
        this.init()
    }

    init() {
        this.tcpServer.on('connection', conn => {
            const remoteAddress = conn.remoteAddress + ':' + conn.remotePort

            console.log(chalk.magentaBright('New client connection from:'), remoteAddress)

            const client = new Client(conn)
            this.clients.set(remoteAddress, client)

            conn.on('data', buff => {
                const packetBuffs = ServerBoundPacketBuffer.fromRawBuffer(buff)

                for (let packetBuffer of packetBuffs) {
                    this.packetHandler.handle(client, packetBuffer)
                }
            })

            conn.once('close', () => {
                console.log(chalk.yellow(`Connection from ${remoteAddress} closed`))
                this.clients.delete(remoteAddress)
            })
            conn.on('error', err => {
                console.log(chalk.redBright(`Connection ${remoteAddress} error:`), err.message)
                this.clients.delete(remoteAddress)
            })
        })

        this.tcpServer.listen(25566, () => {
            console.log(chalk.greenBright('Server listening on'), this.tcpServer.address())
        })
    }

    getPlayer(username: string): Player | null {
        return this.players.find(p => p.username === username) ?? null
    }

    getPlayerByUUID(uuid: UUIDResolvable) {
        return this.players.find(p => p.uuid.equals(uuid)) ?? null
    }

    get players(): Player[] {
        return Array.from(this.clients.values()).filter(c => !!c.player).map(c => c.player!)
    }
} 