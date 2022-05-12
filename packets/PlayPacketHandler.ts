import Client from '../client/client'
import PacketHandler from './PacketHandler'
import C2SPluginMessagePacket from './play/C2SPluginMessagePacket';
import C2SClientSettingsPacket from './play/C2SClientSettingsPacket';
import C2STeleportConfirmPacket from './play/C2STeleportConfirmPacket';
import C2SPlayerPositionPacket from './play/C2SPlayerPositionPacket';
import C2SPlayerPositionRotationPacket from './play/C2SPlayerPositionRotationPacket';
import C2SPlayerRotationPacket from './play/C2SPlayerRotationPacket';

export default class PlayPacketHandler extends PacketHandler {
    init() {
        this.packetMap = new Map([
            [0x05, [C2SClientSettingsPacket, this.onClientSettings]],
            [0x0A, [C2SPluginMessagePacket, this.onPluginMessage]],
            [0x00, [C2STeleportConfirmPacket, this.onTeleportConfirm]],
            [0x11, [C2SPlayerPositionPacket, this.onPlayerPosition]],
            [0x12, [C2SPlayerPositionRotationPacket, this.onPlayerPositionRotation]],
            [0x13, [C2SPlayerRotationPacket, this.onPlayerRotation]],
        ])
    }

    private onPluginMessage(this: Client, packet: C2SPluginMessagePacket) {
        const {channel, data} = packet

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

    private onPlayerRotation(this: Client, packet: C2SPlayerRotationPacket) {
 
    }
}
