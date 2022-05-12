import Client from '../client/client';
import ServerBoundPacketBuffer from '../util/ClientBoundPacketBuffer';

export default interface PacketHandler {
    handle(client: Client, packetBuffer: ServerBoundPacketBuffer): void
}