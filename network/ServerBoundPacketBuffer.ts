import Long from 'long'
import zlib from 'zlib'

import Identifier from '../datatypes/Identifier'
import Vector from '../datatypes/Vector'

class ServerBoundPacketBuffer {
    private static SEGMENT_BITS = 0x7f
    private static CONTINUE_BIT = 0x80

    private buffer: Buffer
    private position: number = 0

    readonly length: number
    readonly lengthPrefixBytes: number
    readonly packetID: number

    constructor(buffer: Buffer, partial?: boolean, compressed?: boolean) {
        this.buffer = buffer

        if (partial) {
            this.length = buffer.length
            this.packetID = -0x01
            this.lengthPrefixBytes = 0
            return
        }

        if (!compressed) {
            this.length = this.readVarInt()
            this.lengthPrefixBytes = Number(this.position)
            this.packetID = this.readVarInt()
        } else {
            this.length = this.readVarInt()
            this.lengthPrefixBytes = Number(this.position)

            const dataLength = this.readVarInt()

            if (dataLength) {
                this.buffer = zlib.inflateSync(buffer.slice(this.position, this.position + dataLength))
                this.position = 0
            }

            this.packetID = this.readVarInt()
        }
    }

    /**
     * Separate Packets from each other by length
     */
    static separateFromRawBuffer(buff: Buffer, compressed?: boolean): ServerBoundPacketBuffer[] {       
        const packet = new ServerBoundPacketBuffer(buff, false, compressed)

        if (packet.buffer.length == packet.length + packet.lengthPrefixBytes) {
            return [packet]
        }

        const packets = []

        let buffer = packet.buffer

        while (buffer.length > 0) {
            const pack = new ServerBoundPacketBuffer(buffer, false, compressed)
            const delim = pack.length + pack.lengthPrefixBytes
            const packBuff = buffer.slice(0, delim)
            packets.push(new ServerBoundPacketBuffer(packBuff, false, compressed))

            buffer = buffer.slice(delim)
        }

        return packets
    }

    readVarInt(): number {
        let value = 0
        let position = 0
        let currentByte

        while (true) {
            currentByte = this.buffer[this.position++]
            value |= (currentByte & ServerBoundPacketBuffer.SEGMENT_BITS) << position

            if ((currentByte & ServerBoundPacketBuffer.CONTINUE_BIT) == 0) break

            position += 7

            if (position >= 32) throw new Error('VarInt is too big')
        }

        return value
    }

    readVarLong(): bigint {
        let value = new Long(0)
        let position = new Long(0)
        let currentByte

        while (true) {
            currentByte = this.buffer[this.position++]

            value = value.or(new Long(currentByte).and(ServerBoundPacketBuffer.SEGMENT_BITS).shiftLeft(position))

            if ((currentByte & ServerBoundPacketBuffer.CONTINUE_BIT) == 0) break

            position = position.add(7)

            if (position.greaterThanOrEqual(64)) throw new Error('VarLong is too big')
        }

        return Buffer.from(value.toBytesLE()).readBigInt64LE()
    }

    readBoolean(): boolean {
        const val = this.buffer[this.position++]

        switch (val) {
            case 0x00:
                return false
            case 0x01:
                return true
            default:
                throw new Error('Unexpected Value for Boolean')
        }
    }

    readByte(): number {
        return this.buffer.readInt8(this.position++)
    }

    readUnsignedByte(): number {
        return this.buffer.readUInt8(this.position++)
    }

    readShort(): number {
        this.position += 2
        return this.buffer.readInt16BE(this.position - 2)
    }

    readUnsignedShort(): number {
        this.position += 2
        return this.buffer.readUInt16BE(this.position - 2)
    }

    readInt(): number {
        this.position += 4
        return this.buffer.readInt32BE(this.position - 4)
    }

    readLong(): bigint {
        this.position += 8
        return this.buffer.readBigInt64BE(this.position - 8)
    }

    readFloat(): number {
        this.position += 4
        return this.buffer.readFloatBE(this.position - 4)
    }

    readDouble(): number {
        this.position += 8
        return this.buffer.readDoubleBE(this.position - 8)
    }

    readString(maxLen?: number): string {
        const length = this.readVarInt()

        if (typeof maxLen != 'undefined' && length > maxLen) throw new Error('String is over max specified length')

        const val = this.buffer.toString('utf-8', this.position, this.position + length)
        this.position += length
        return val
    }

    readIdentifier(): Identifier {
        return new Identifier(this.readString())
    }

    readBuffer(): Buffer {
        const buff = this.buffer.slice(this.position)
        this.position = this.buffer.length - 1
        return buff
    }

    readEncodedBuffer(): ServerBoundPacketBuffer {
        return new ServerBoundPacketBuffer(this.readBuffer(), true)
    }

    readPosition(): Vector {
        const buff = Buffer.alloc(8)
        buff.writeBigInt64BE(this.readLong())

        let val = new Long(buff.readInt32BE(4), buff.readInt32BE())

        const x = val.shiftRight(38)
        const y = val.shiftLeft(52).shiftRight(52)
        const z = val.shiftRight(12).and(0x3ffffff)

        return new Vector(x.toInt(), y.toInt(), z.toInt())
    }
}

export default ServerBoundPacketBuffer
