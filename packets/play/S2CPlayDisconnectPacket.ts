import { ChatComponent } from '../../util/Chat'
import S2CPacket from '../S2CPacket'

export default class S2CPlayDisconnectPacket extends S2CPacket {
    constructor(readonly chat: ChatComponent) {
        super(0x1a)

        this.packetBuffer.writeChat(chat)
    }
}
