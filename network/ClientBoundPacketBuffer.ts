import chalk from 'chalk'
import Long from 'long'
import nbt from 'prismarine-nbt'
import util from 'util'
import zlib from 'zlib'
import MinecraftServer from '..'

import BitSet from '../datatypes/BitSet'
import BlockPos from '../datatypes/BlockPos'
import { ChatComponent } from '../datatypes/Chat'
import Identifier from '../datatypes/Identifier'
import UUID, { UUIDResolvable } from '../datatypes/UUID'

export default class ClientBoundPacketBuffer {
    private static SEGMENT_BITS = 0x7f
    private static CONTINUE_BIT = 0x80

    private buffers: Buffer[]

    readonly packetID: number

    constructor(id: number = -1) {
        this.packetID = id

        this.buffers = []
    }

    serialize(partial?: boolean, compress?: boolean): Buffer {
        const data = Buffer.concat(this.buffers)

        if (partial) return data

        const packetID = this.encodeVarInt(this.packetID)

        const payload = Buffer.concat([packetID, data])

        return compress ? this.serializeCompressed(payload) : this.serializeUncompressed(payload)
    }

    private serializeUncompressed(payload: Buffer): Buffer {
        const length = this.encodeVarInt(payload.length)

        return Buffer.concat([length, payload])
    }

    private serializeCompressed(payload: Buffer): Buffer {
        const shouldCompress = payload.length < MinecraftServer.PACKET_COMPRESSION_THRESHOLD

        const dataLength = this.encodeVarInt(shouldCompress ? payload.length : 0)
        const compressedPayload = shouldCompress ? zlib.deflateSync(payload) : payload

        const combinedPayload = Buffer.concat([dataLength, compressedPayload])
        const combinedLength = this.encodeVarInt(combinedPayload.length)

        return Buffer.concat([combinedLength, combinedPayload])
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

    writeNBT(nbtTag: nbt.NBT | nbt.Tags['compound']) {
        const buff = Buffer.alloc(nbt.proto.sizeOf(nbtTag, 'nbt'))
        nbt.proto.write(nbtTag, buff, 0, 'nbt')
        this.buffers.push(buff)
    }

    writeBuffer(buff: Buffer) {
        this.buffers.push(buff)
    }

    writeBlockPos(pos: BlockPos) {
        const { x, y, z } = pos

        // ((x & 0x3FFFFFF) << 38) | ((z & 0x3FFFFFF) << 12) | (y & 0xFFF)

        let xl = new Long(x & 0x3ffffff).shiftLeft(38)
        let zl = new Long(z & 0x3ffffff).shiftLeft(12)
        let yl = new Long(y & 0xfff)

        let value = xl.or(zl).or(yl)

        let buff = Buffer.alloc(8)

        buff.writeUInt32BE(value.getLowBitsUnsigned(), 4)
        buff.writeUInt32BE(value.getHighBitsUnsigned())

        this.buffers.push(buff)
    }

    writeBitSet(bits: BitSet) {
        const longs = bits.toLongArray()

        this.writeVarInt(longs.length)
        for (const long of longs) {
            this.writeLong(long)
        }
    }

    writeAngle(angle: number) {
        if (Math.sign(angle) === 1) {
            while (angle > 360) angle -= 360
        } else if (Math.sign(angle) === -1) {
            while (angle < 0) angle += 360
        }

        angle /= 360
        angle *= 256

        angle = Math.floor(angle)

        this.writeUnsignedByte(angle)
    }

    [util.inspect.custom]() {
        return chalk.red(`(0x${this.packetID.toString(16)})`)
    }
}
