import fs from 'fs'

import MinecraftServer from '../..'
import Client from '../../client/Client'
import C2SPingPacket from '../packets/status/C2SPingPacket'
import C2SRequestPacket from '../packets/status/C2SRequestPacket'
import S2CPongPacket from '../packets/status/S2CPongPacket'
import S2CResponsePacket from '../packets/status/S2CResponsePacket'
import AbstractPacketHandler from './AbstractPacketHandler'

export default class StatusPacketHandler extends AbstractPacketHandler {
    private responseSent: boolean = false
    
    init() {
        this.packetMap = new Map([
            [0x00, [C2SRequestPacket, this.onRequest]],
            [0x01, [C2SPingPacket, this.onPing]],
        ])
    }

    private onRequest(packet: C2SRequestPacket) {
        if (this.responseSent) {
            this.client.conn.destroy()
            return
        }
        
        // Send SPL JSON response
        this.client.sendPacket(
            new S2CResponsePacket({
                version: {
                    name: MinecraftServer.MC_VERSION,
                    protocol: MinecraftServer.PROTO_VERSION,
                },
                players: {
                    max: 69,
                    online: 0,
                    sample: [],
                },
                description: {
                    text: `§cHydrogen Server (${MinecraftServer.VERSION})`,
                },
                favicon: `data:image/png;base64,${fs.readFileSync('./server-icon.png').toString('base64')}`,
            })
        )

        this.responseSent = true
    }

    private onPing(packet: C2SPingPacket) {
        // Send back ping payload
        this.client.sendPacket(new S2CPongPacket(packet.payload))
        this.client.conn.destroy()
    }
}
