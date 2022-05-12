import Client from '../client/client'
import PacketHandler from './PacketHandler'
import C2SPingPacket from './status/C2SPingPacket'
import C2SRequestPacket from './status/C2SRequestPacket'
import S2CPongPacket from './status/S2CPongPacket'
import S2CResponsePacket from './status/S2CResponsePacket'

export default class StatusPacketHandler extends PacketHandler {
    init() {
        this.packetMap = new Map([
            [0x00, [C2SRequestPacket, this.onRequest]],
            [0x01, [C2SPingPacket, this.onPing]],
        ])
    }

    private onRequest(this: Client, packet: C2SRequestPacket) {
        // Send SPL JSON response

        this.sendPacket(
            new S2CResponsePacket({
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
                    text: '§cHydrogen (1.0-Alpha)',
                },
            })
        )
    }

    private onPing(this: Client, packet: C2SPingPacket) {
        // Send back ping payload
        this.sendPacket(new S2CPongPacket(packet.payload))
        this.conn.destroy()
    }
}
