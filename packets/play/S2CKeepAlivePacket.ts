import S2CPacket from '../S2CPacket'

export default class S2CKeepAlivePacket extends S2CPacket {
    constructor(readonly keepAliveId: number) {
        super(0x0f)

        this.packetBuffer.writeLong(BigInt(keepAliveId))
    }
}
