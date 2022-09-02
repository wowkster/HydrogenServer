import MinecraftServer from '../..'
import { ConnectionState } from '../../client/Client'
import UUID from '../../datatypes/UUID'
import Player from '../../entity/player/Player'
import C2SEncryptionResponsePacket from '../packets/login/C2SEncryptionResponsePacket'
import C2SLoginStartPacket from '../packets/login/C2SLoginStartPacket'
import C2SPluginResponsePacket from '../packets/login/C2SPluginResponsePacket'
import S2CLoginSuccessPacket from '../packets/login/S2CLoginSuccessPacket'
import S2CSetCompressionPacket from '../packets/login/S2CSetCompressionPacket'
import AbstractPacketHandler from './AbstractPacketHandler'
import PlayPacketHandler from './PlayPacketHandler'

enum LoginState {
    START,
    KEY,
    AUTHENTICATING,
    NEGOTIATING,
    READY_TO_ACCEPT,
    DELAY_ACCEPT,
    ACCEPTED,
}

export default class LoginPacketHandler extends AbstractPacketHandler {
    private loginTicks: number = 0
    private state: LoginState = LoginState.START
    private username?: string
    private uuid?: UUID

    init() {
        this.packetMap = new Map([
            [0x00, [C2SLoginStartPacket, this.onLoginStart]],
            [0x01, [C2SEncryptionResponsePacket, this.onEncryptionResponse]],
            [0x02, [C2SPluginResponsePacket, this.onPluginResponse]],
        ])
    }

    public tick(): void {
        // If login has taken more than 30 seconds, kick the client
        if (this.loginTicks++ == 30 * 20) {
            this.disconnect('Took too long to login!')
        }

        if (this.state == LoginState.READY_TO_ACCEPT) {
            this.acceptPlayer();
        }
    }

    private onLoginStart(packet: C2SLoginStartPacket) {
        if (this.state !== LoginState.START) {
            throw new Error('Unexpected C2SLoginStartPacket')
        }

        if (!/[a-zA-Z0-9_]/.test(packet.username)) {
            this.disconnect('Invalid characters in username!')
            return
        }

        this.username = packet.username

        if (MinecraftServer.ONLINE_MODE) {
            this.state = LoginState.KEY
            // TODO Add encryption
        } else {
            this.state = LoginState.READY_TO_ACCEPT
        }
    }

    private onEncryptionResponse(packet: C2SEncryptionResponsePacket) {
        // TODO
    }

    private onPluginResponse(packet: C2SPluginResponsePacket) {
        // TODO
    }

    acceptPlayer() {
        // TODO Check if player is banned

        this.state = LoginState.ACCEPTED

        // Enable packet compression
        if (MinecraftServer.PACKET_COMPRESSION_THRESHOLD >= 0) {
            this.client.sendPacket(new S2CSetCompressionPacket(MinecraftServer.PACKET_COMPRESSION_THRESHOLD))
            this.client.compressionEnabled = true
        }

        // Create player
        const player = new Player(new UUID(), this.username!, this.client)
        this.client.player = player

        // TODO if player is already on server, wait until the other connection has disconnected (LoginState.DELAY_ACCEPT)

        // Send login success
        this.client.sendPacket(new S2CLoginSuccessPacket(player.uuid, player.username))

        // Switch state to PLAY and send initial game packets
        this.client.packetHandler = new PlayPacketHandler(this.client)
        this.client.state = ConnectionState.PLAY

        MinecraftServer.INSTANCE.onPlayerConnect(this.client, player)
    }
}
