import MinecraftServer from '../..'
import Identifier from '../../util/Identifier'
import S2CPacket from '../S2CPacket'

export default class S2CPluginMessagePacket extends S2CPacket {
    constructor(readonly channel: Identifier, readonly data: Buffer | string) {
        super(0x18)
        this.packetBuffer.writeIdentifier(channel)

        if (typeof data === 'string') {
            this.packetBuffer.writeString(data)
        } else {
            this.packetBuffer.writeBuffer(data)
        }
    }

    /**
     * Must be a getter to access server version
     */
    static get BRAND_PACKET(): S2CPluginMessagePacket {
        return new S2CPluginMessagePacket(new Identifier('brand'), `Hydrogen (${MinecraftServer.VERSION})`)
    }
}
