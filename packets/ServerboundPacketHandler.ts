import StatusPacketHandler from './StatusPacketHandler';
export default class ServerBoundPacketHandler {
    statusPacketHandler: StatusPacketHandler
    
    constructor() {
        this.statusPacketHandler = new StatusPacketHandler()
    }

    
}