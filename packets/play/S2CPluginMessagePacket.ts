import Identifier from '../../util/Identifier'
import S2CPacket from '../S2CPacket'

export default class S2CPluginMessagePacket extends S2CPacket {
    static BRAND_PACKET = new S2CPluginMessagePacket(new Identifier('brand'), 'Hydrogen (1.0-alpha)')

    constructor(channel: Identifier, data: Buffer | string) {
        super(0x18)
        this.packetBuffer.writeIdentifier(channel)

        if (typeof data === 'string') {
            this.packetBuffer.writeString(data)
        } else {
            this.packetBuffer.writeBuffer(data)
        }
    }
}
