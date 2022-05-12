import Identifier from '../../util/Identifier'
import S2CPacket from '../S2CPacket'

export default class S2CPluginMessagePacket extends S2CPacket {
    static BRAND_PACKET = new S2CPluginMessagePacket(new Identifier('brand'), Buffer.from('hydrogen', 'utf-8'))
    
    constructor(channel: Identifier, data: Buffer) {
        super(0x18)
        this.packetBuffer.writeIdentifier(channel)
        this.packetBuffer.writeBuffer(data)
    }
}
