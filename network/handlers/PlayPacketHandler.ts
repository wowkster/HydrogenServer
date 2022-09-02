import Client from '../../client/Client'
import AbstractPacketHandler from './AbstractPacketHandler'

import C2SClientSettingsPacket from '../packets/play/C2SClientSettingsPacket'
import C2SKeepAlivePacket from '../packets/play/C2SKeepAlivePacket'
import C2SPlayerMovementPacket, {
    C2SPlayerOnGroundPacket,
    C2SPlayerPositionPacket,
    C2SPlayerPositionRotationPacket,
    C2SPlayerRotationPacket,
} from '../packets/play/C2SPlayerMovementPacket'
import C2SPluginMessagePacket from '../packets/play/C2SPluginMessagePacket'
import C2STeleportConfirmPacket from '../packets/play/C2STeleportConfirmPacket'
import S2CKeepAlivePacket from '../packets/play/S2CKeepAlivePacket'
import S2CPlayDisconnectPacket from '../packets/play/S2CPlayDisconnectPacket'

export default class PlayPacketHandler extends AbstractPacketHandler {
    // Keep Alive
    waitingForKeepAlive: boolean
    lastKeepAliveIdSent: number
    lastKeepAliveReceived: Date

    constructor(client: Client) {
        super(client)

        this.waitingForKeepAlive = false
        this.lastKeepAliveIdSent = 0
        this.lastKeepAliveReceived = new Date()
    }

    init() {
        this.packetMap = new Map([
            [0x05, [C2SClientSettingsPacket, this.onClientSettings]],
            [0x0f, [C2SKeepAlivePacket, this.onKeepAlive]],
            [0x0a, [C2SPluginMessagePacket, this.onPluginMessage]],
            [0x00, [C2STeleportConfirmPacket, this.onTeleportConfirm]],
            [0x11, [C2SPlayerPositionPacket, this.onPlayerMovement]],
            [0x12, [C2SPlayerPositionRotationPacket, this.onPlayerMovement]],
            [0x13, [C2SPlayerRotationPacket, this.onPlayerMovement]],
            [0x14, [C2SPlayerOnGroundPacket, this.onPlayerMovement]],
        ])
    }

    tick() {
        // If client has not responded for over 30 seconds, disconnect them
        if (this.waitingForKeepAlive && this.lastKeepAliveReceived.getTime() < Date.now() - 1000 * 30) {
            this.disconnect('Keepalive timeout')
            return
        }

        // Send keepalive packets every 10 seconds
        if (!this.waitingForKeepAlive && this.lastKeepAliveReceived.getTime() < Date.now() - 1000 * 10) {
            const id = Math.floor(Math.random() * 0xffff)

            this.lastKeepAliveIdSent = id
            this.waitingForKeepAlive = true
            this.client.sendPacket(new S2CKeepAlivePacket(id))
        }
    }

    disconnect(reason: string) {
        this.client.sendPacket(
            new S2CPlayDisconnectPacket({
                text: reason,
            })
        )
        this.client.conn.destroy()
    }

    private onPluginMessage(packet: C2SPluginMessagePacket) {
        const { channel, data } = packet

        if (channel.equals('minecraft:brand')) {
            this.client.brand = data.readString()
            return
        }

        // Discard Other Messages
    }

    private onClientSettings(packet: C2SClientSettingsPacket) {
        // Set client settings
        this.client.settings = packet.clientSettings
    }

    private onTeleportConfirm(packet: C2STeleportConfirmPacket) {
        // Do something with teleport ID
        // if this.player.lastRequestedTeleport()
    }

    private onPlayerMovement(packet: C2SPlayerMovementPacket) {
        // TODO Check if player moved too fast! https://wiki.vg/Protocol#Player_Position
    }

    private onKeepAlive(packet: C2SKeepAlivePacket) {
        // Make sure we are expecting a packet
        if (!this.waitingForKeepAlive) {
            this.disconnect('Unexpected keep alive packet received!')
            return
        }

        // Make sure that the keep alive ID is the same as the last one we sent
        if (this.lastKeepAliveIdSent != packet.keepAliveId) {
            this.disconnect(`KeepAlive ID mismatch: ${packet.keepAliveId} != ${this.lastKeepAliveIdSent}`)
            return
        }

        // Set the last keep alive received time
        this.lastKeepAliveReceived = new Date()
        this.waitingForKeepAlive = false
    }
}
