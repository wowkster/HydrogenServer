import Long from 'long'
import { parse } from 'uuid'
import { ChatComponent } from './Chat'
import Identifier from './Identifier'
import nbt from 'prismarine-nbt'
import UUID, { UUIDResolvable } from './UUID'
import Position from './Position';
import Vector from './Vector'

export default class ClientBoundPacketBuffer {
    private static SEGMENT_BITS = 0x7f
    private static CONTINUE_BIT = 0x80

    private buffers: Buffer[]

    readonly packetID: number

    constructor(id: number = -1) {
        this.packetID = id

        this.buffers = []
    }

    serialize(partial?: boolean): Buffer {
        const data = Buffer.concat(this.buffers)

        if (partial) return data

        const packetID = this.encodeVarInt(this.packetID)

        const payload = Buffer.concat([packetID, data])
        const length = this.encodeVarInt(payload.length)

        return Buffer.concat([length, payload])
    }

    private encodeVarInt(value: number): Buffer {
        const bytes = []

        while (true) {
            if ((value & ~ClientBoundPacketBuffer.SEGMENT_BITS) == 0) {
                bytes.push(value)
                break
            }

            bytes.push((value & ClientBoundPacketBuffer.SEGMENT_BITS) | ClientBoundPacketBuffer.CONTINUE_BIT)

            // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
            value >>>= 7
        }

        return Buffer.from(bytes)
    }

    writeVarInt(value: number) {
        this.buffers.push(this.encodeVarInt(value))
    }

    writeVarLong(value: bigint) {
        const bytes: Long[] = []

        const buff = Buffer.alloc(8)
        buff.writeBigInt64BE(value)

        let val = new Long(buff.readInt32BE(4), buff.readInt32BE())

        while (true) {
            if (val.and(new Long(ClientBoundPacketBuffer.SEGMENT_BITS).not()).eq(0)) {
                bytes.push(val)
                break
            }

            bytes.push(
                val
                    .and(new Long(ClientBoundPacketBuffer.SEGMENT_BITS))
                    .or(new Long(ClientBoundPacketBuffer.CONTINUE_BIT))
            )

            // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
            val = val.shiftRightUnsigned(7)
        }

        this.buffers.push(Buffer.from(bytes.map(l => l.toInt())))
    }

    writeBoolean(value: boolean) {
        this.buffers.push(Buffer.from([value ? 0x01 : 0x00]))
    }

    writeByte(byte: number) {
        const buff = Buffer.alloc(1)
        buff.writeInt8(byte)
        this.buffers.push(buff)
    }

    writeUnsignedByte(byte: number) {
        const buff = Buffer.alloc(1)
        buff.writeUInt8(byte)
        this.buffers.push(buff)
    }

    writeShort(short: number) {
        const buff = Buffer.alloc(2)
        buff.writeInt16BE(short)
        this.buffers.push(buff)
    }

    writeUnsignedShort(short: number) {
        const buff = Buffer.alloc(2)
        buff.writeUInt16BE(short)
        this.buffers.push(buff)
    }

    writeInt(int: number) {
        const buff = Buffer.alloc(4)
        buff.writeInt32BE(int)
        this.buffers.push(buff)
    }

    writeLong(long: bigint) {
        const buff = Buffer.alloc(8)
        buff.writeBigInt64BE(long)
        this.buffers.push(buff)
    }

    writeFloat(float: number) {
        const buff = Buffer.alloc(4)
        buff.writeFloatBE(float)
        this.buffers.push(buff)
    }

    writeDouble(double: number) {
        const buff = Buffer.alloc(8)
        buff.writeDoubleBE(double)
        this.buffers.push(buff)
    }

    writeString(str: string, maxLen?: number) {
        if (typeof maxLen != 'undefined' && str.length > maxLen)
            throw new Error('Tried to write a string that was too long')
        const buff = Buffer.from(str, 'utf-8')
        this.buffers.push(Buffer.concat([this.encodeVarInt(buff.length), buff]))
    }

    writeUUID(uuid: UUIDResolvable): void {
        this.buffers.push(Buffer.from(UUID.serialize(uuid)))
    }

    writeJSON(json: object) {
        this.writeString(JSON.stringify(json))
    }

    writeChat(chat: ChatComponent) {
        this.writeJSON(chat)
    }

    writeIdentifier(identifier: Identifier) {
        this.writeString(identifier.toString())
    }

    writeNBT(nbtTag: nbt.NBT) {
        const buff = nbt.writeUncompressed(nbtTag)
        this.buffers.push(buff)
    }

    writeBuffer(buff: Buffer) {
        this.buffers.push(buff)
    }

    writePosition(pos: Vector | Position) {
        const {x, y, z} = pos

        // ((x & 0x3FFFFFF) << 38) | ((z & 0x3FFFFFF) << 12) | (y & 0xFFF)

        let xl = new Long(x & 0x3FFFFFF).shiftLeft(38)
        let zl = new Long(z & 0x3FFFFFF).shiftLeft(12)
        let yl = new Long(y & 0xFFF)

        let value = xl.or(zl).or(yl)

        let buff = Buffer.alloc(8)

        buff.writeUInt32BE(value.getLowBitsUnsigned(), 4)
        buff.writeUInt32BE(value.getHighBitsUnsigned())

        this.buffers.push(buff)
    }
}
