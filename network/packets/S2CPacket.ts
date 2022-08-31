import nbt from 'prismarine-nbt'

import { ChatComponent } from '../../datatypes/Chat'
import Identifier from '../../datatypes/Identifier'
import Position from '../../datatypes/Position'
import { UUIDResolvable } from '../../datatypes/UUID'
import Vector from '../../datatypes/Vector'
import ClientBoundPacketBuffer from '../ClientBoundPacketBuffer'

export default abstract class S2CPacket {
    packetBuffer: ClientBoundPacketBuffer

    constructor(packetId: number) {
        this.packetBuffer = new ClientBoundPacketBuffer(packetId)
    }

    serialize(): Buffer {
        return this.packetBuffer.serialize()
    }

    protected writeVarInt(value: number) {
        this.packetBuffer.writeVarInt(value)
    }

    protected writeVarLong(value: bigint) {
        this.packetBuffer.writeVarLong(value)
    }

    protected writeBoolean(value: boolean) {
        this.packetBuffer.writeBoolean(value)
    }

    protected writeByte(value: number) {
        this.packetBuffer.writeByte(value)
    }

    protected writeUnsignedByte(value: number) {
        this.packetBuffer.writeUnsignedByte(value)
    }

    protected writeShort(value: number) {
        this.packetBuffer.writeShort(value)
    }

    protected writeUnsignedShort(value: number) {
        this.packetBuffer.writeUnsignedShort(value)
    }

    protected writeInt(value: number) {
        this.packetBuffer.writeInt(value)
    }

    protected writeLong(value: bigint) {
        this.packetBuffer.writeLong(value)
    }

    protected writeFloat(value: number) {
        this.packetBuffer.writeFloat(value)
    }

    protected writeDouble(value: number) {
        this.packetBuffer.writeDouble(value)
    }

    protected writeString(value: string, maxLen?: number) {
        this.packetBuffer.writeString(value, maxLen)
    }

    protected writeUUID(value: UUIDResolvable) {
        this.packetBuffer.writeUUID(value)
    }

    protected writeJSON(value: object) {
        this.packetBuffer.writeJSON(value)
    }

    protected writeChat(value: ChatComponent) {
        this.packetBuffer.writeChat(value)
    }

    protected writeIdentifier(value: Identifier) {
        this.packetBuffer.writeIdentifier(value)
    }

    protected writeNBT(value: nbt.NBT) {
        this.packetBuffer.writeNBT(value)
    }

    protected writeBuffer(value: Buffer) {
        this.packetBuffer.writeBuffer(value)
    }

    protected writePosition(value: Vector | Position) {
        this.packetBuffer.writePosition(value)
    }
}
