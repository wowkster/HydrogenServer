import net from 'net'
import chalk from 'chalk'
import ServerBoundPacketBuffer from './util/ServerBoundPacketBuffer'
import C2SHandshakePacket from './packets/handshake/C2SHandshakePacket'
import Client, { ConnectionState } from './client/client'
import C2SLoginStartPacket from './packets/login/C2SLoginStartPacket'
import C2SRequestPacket from './packets/status/C2SRequestPacket'
import C2SPingPacket from './packets/status/C2SPingPacket'
import S2CLoginSuccessPacket from './packets/login/S2CLoginSuccessPacket'
import { NIL } from 'uuid'
import S2CResponsePacket from './packets/status/S2CResponsePacket'
import S2CPongPacket from './packets/status/S2CPongPacket'
import S2CLoginDisconnectPacket from './packets/login/S2CLoginDisconnectPacket'

import S2CJoinGamePacket from './packets/play/S2CJoinGamePacket'
import S2CPluginMessagePacket from './packets/play/S2CPluginMessagePacket'
import S2CServerDifficultyPacket from './packets/play/S2CServerDifficultyPacket'
import { Difficulty } from './util/PlayEnums'
import S2CPlayerAbilitiesPacket from './packets/play/S2CPlayerAbilitiesPacket';
import PlayerAbilities, { PlayerAbilityFlags } from './client/play/PlayerAbilities'

const server = net.createServer()

// Maps addresses to clients
const clients = new Map<string, Client>()

server.on('connection', conn => {
    const remoteAddress = conn.remoteAddress + ':' + conn.remotePort

    console.log(chalk.magentaBright('New client connection from:'), remoteAddress)

    const client = new Client(conn)
    clients.set(remoteAddress, client)

    conn.on('data', buff => {
        console.log(chalk.blueBright(`Connection data from ${remoteAddress}:`), buff)

        const packetBuffs = ServerBoundPacketBuffer.fromRawBuffer(buff)

        for (let packetBuffer of packetBuffs) {
            console.log(chalk.cyan('Packet Length:'), packetBuffer.length)
            console.log(chalk.cyan('Packet ID:'), packetBuffer.packetID)

            const { packetID } = packetBuffer

            switch (client.state) {
                case ConnectionState.HANDSHAKE:
                    switch (packetID) {
                        case 0x00:
                            const handshake = new C2SHandshakePacket(packetBuffer)

                            console.log(chalk.cyan('Handshake Packet:'), handshake)
                            client.state = handshake.nextState
                            break
                        default:
                            throw new Error(`Invalid Packet ID ${packetID}`)
                    }
                    break

                case ConnectionState.STATUS:
                    switch (packetID) {
                        case 0x00:
                            const request = new C2SRequestPacket(packetBuffer)
                            console.log(chalk.cyan('SLP Request Packet:'), request)
                            const res = new S2CResponsePacket({
                                version: {
                                    name: '1.18.2',
                                    protocol: 758,
                                },
                                players: {
                                    max: 69,
                                    online: 0,
                                    sample: [],
                                },
                                description: {
                                    text: 'Your Mom',
                                },
                            })
                            console.log(chalk.red('SLP Response Packet:'), res)
                            client.sendPacket(res)
                            break

                        case 0x01:
                            const ping = new C2SPingPacket(packetBuffer)
                            client.sendPacket(new S2CPongPacket(ping.payload))
                            break
                        default:
                            throw new Error(`Invalid Packet ID ${packetID}`)
                    }
                    break
                case ConnectionState.LOGIN:
                    switch (packetID) {
                        case 0x00:
                            const loginStart = new C2SLoginStartPacket(packetBuffer)

                            console.log(chalk.cyan('Login Start:'), loginStart)

                            client.uuid = NIL
                            client.username = loginStart.username

                            const loginSuccess = new S2CLoginSuccessPacket(client.uuid, client.username)
                            console.log(chalk.red('Login Success Packet:'), loginSuccess)
                            client.sendPacket(loginSuccess)

                            client.state = ConnectionState.PLAY

                            const joinPacket = new S2CJoinGamePacket()
                            console.log(chalk.red('Join Game Packet:'), joinPacket)
                            client.sendPacket(joinPacket)

                            console.log(chalk.red('Brand Packet:'), S2CPluginMessagePacket.BRAND_PACKET)
                            client.sendPacket(S2CPluginMessagePacket.BRAND_PACKET)

                            const difficultyPacket = new S2CServerDifficultyPacket(Difficulty.EASY, true)
                            console.log(chalk.red('Server Difficulty Packet:'), difficultyPacket)
                            client.sendPacket(difficultyPacket)

                            const abilitiesPacket = new S2CPlayerAbilitiesPacket(new PlayerAbilities([PlayerAbilityFlags.ALLOW_FLYING, PlayerAbilityFlags.FLYING]))
                            console.log(chalk.red('Player Abilities Packet:'), abilitiesPacket)
                            client.sendPacket(abilitiesPacket)
                            break
                        default:
                            throw new Error(`Invalid Packet ID ${packetID}`)
                    }
            }
        }
    })

    conn.once('close', () => {
        console.log(chalk.yellow(`Connection from ${remoteAddress} closed`))
        clients.delete(remoteAddress)
    })
    conn.on('error', err => {
        console.log(chalk.redBright(`Connection ${remoteAddress} error:`), err.message)
        clients.delete(remoteAddress)
    })
})

server.listen(25566, function () {
    console.log(chalk.greenBright('Server listening on'), server.address())
})
