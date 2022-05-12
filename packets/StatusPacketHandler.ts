import client from "../client/client";
import ClientBoundPacketBuffer from "../util/ClientBoundPacketBuffer";
import PacketHandler from "./PacketHandler";

export default class StatusPacketHandler implements PacketHandler {
    handle(client: client, packetBuffer: ClientBoundPacketBuffer) {
        
    }
}