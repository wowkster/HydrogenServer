import S2CPacket from '../S2CPacket';
import { ChatComponent } from '../../util/Chat';

export default class S2CLoginDisconnectPacket extends S2CPacket {
    constructor(readonly reason: ChatComponent) {
        super(0x00)
        this.packetBuffer.writeChat(reason)
    }
}