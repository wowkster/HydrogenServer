import Client from '../../client/Client'
import AbstractPacketHandler from './AbstractPacketHandler'

import C2SClientSettingsPacket from '../packets/play/C2SClientSettingsPacket'
import C2SKeepAlivePacket from '../packets/play/C2SKeepAlivePacket'
import C2SPlayerMovementPacket from '../packets/play/C2SPlayerMovementPacket'
import C2SPlayerPositionPacket from '../packets/play/C2SPlayerPositionPacket'
import C2SPlayerPositionRotationPacket from '../packets/play/C2SPlayerPositionRotationPacket'
import C2SPlayerRotationPacket from '../packets/play/C2SPlayerRotationPacket'
import C2SPluginMessagePacket from '../packets/play/C2SPluginMessagePacket'
import C2STeleportConfirmPacket from '../packets/play/C2STeleportConfirmPacket'

export default class PlayPacketHandler extends AbstractPacketHandler {
    init() {
        this.packetMap = new Map([
            [0x05, [C2SClientSettingsPacket, this.onClientSettings]],
            [0x0f, [C2SKeepAlivePacket, this.onKeepAlive]],
            [0x0a, [C2SPluginMessagePacket, this.onPluginMessage]],
            [0x00, [C2STeleportConfirmPacket, this.onTeleportConfirm]],
            [0x11, [C2SPlayerPositionPacket, this.onPlayerPosition]],
            [0x12, [C2SPlayerPositionRotationPacket, this.onPlayerPositionRotation]],
            [0x13, [C2SPlayerRotationPacket, this.onPlayerRotation]],
            [0x14, [C2SPlayerMovementPacket, this.onPlayerMovement]],
        ])
    }

    private onPluginMessage(this: Client, packet: C2SPluginMessagePacket) {
        const { channel, data } = packet

        if (channel.equals('minecraft:brand')) {
            this.brand = data.readString()
            return
        }

        // Discard Other Messages
    }

    private onClientSettings(this: Client, packet: C2SClientSettingsPacket) {
        // Set client settings
        this.settings = packet.clientSettings
    }

    private onTeleportConfirm(this: Client, packet: C2STeleportConfirmPacket) {
        // Do something with teleport ID
    }

    private onPlayerPosition(this: Client, packet: C2SPlayerPositionPacket) {
        // TODO Check if player moved too fast! https://wiki.vg/Protocol#Player_Position
    }

    private onPlayerPositionRotation(this: Client, packet: C2SPlayerPositionRotationPacket) {
        // TODO Check if player moved too fast! https://wiki.vg/Protocol#Player_Position
    }

    private onPlayerRotation(this: Client, packet: C2SPlayerRotationPacket) {}

    private onPlayerMovement(this: Client, packet: C2SPlayerMovementPacket) {}

    private onKeepAlive(this: Client, packet: C2SKeepAlivePacket) {
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
