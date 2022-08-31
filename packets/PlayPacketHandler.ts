import Client from '../client/client'
import PacketHandler from './PacketHandler'

import C2SKeepAlivePacket from './play/C2SKeepAlivePacket'

import C2SClientSettingsPacket from './play/C2SClientSettingsPacket'
import C2SPlayerMovementPacket from './play/C2SPlayerMovementPacket'
import C2SPlayerPositionPacket from './play/C2SPlayerPositionPacket'
import C2SPlayerPositionRotationPacket from './play/C2SPlayerPositionRotationPacket'
import C2SPlayerRotationPacket from './play/C2SPlayerRotationPacket'
import C2SPluginMessagePacket from './play/C2SPluginMessagePacket'
import C2STeleportConfirmPacket from './play/C2STeleportConfirmPacket'
import S2CPlayDisconnectPacket from './play/S2CPlayDisconnectPacket'

export default class PlayPacketHandler extends PacketHandler {
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
        // Make sure that the keep alive ID is the same as the last one we sent
        if (this.lastKeepAliveIdSent != packet.keepAliveId) {
            this.sendPacket(
                new S2CPlayDisconnectPacket({
                    text: `KeepAlive ID mismatch: ${packet.keepAliveId} != ${this.lastKeepAliveIdSent}`,
                })
            )
            this.conn.destroy()
            return
        }

        // Set the last keep alive received time
        this.lastKeepAliveReceived = new Date()
    }
}
