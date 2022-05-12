import Long from 'long'

class ServerBoundPacketBuffer {
    private static SEGMENT_BITS = 0x7f
    private static CONTINUE_BIT = 0x80

    private buffer: Buffer
    private position: number = 0

    readonly length: number
    readonly lengthBytes: number
    readonly packetID: number

    constructor(buffer: Buffer, partial?: true) {
        this.buffer = buffer

        if (partial) {
            this.length = buffer.length
            this.packetID = -0x01
            this.lengthBytes = 0
            return
        }

        this.length = this.readVarInt()
        this.lengthBytes = Number(this.position)
        this.packetID = this.readVarInt()
    }

    /**
     * Separate Packets from each other by length
     */
    static fromRawBuffer(buff: Buffer): ServerBoundPacketBuffer[] {
        const packet = new ServerBoundPacketBuffer(buff)

        if (packet.buffer.length == packet.length + packet.lengthBytes) {
            return [packet]
        }

        const packets = []

        let buffer = packet.buffer

        while (buffer.length > 0) {
            const pack = new ServerBoundPacketBuffer(buffer)
            const delim = pack.length + pack.lengthBytes
            const packBuff = pack.buffer.slice(0, delim)
            packets.push(new ServerBoundPacketBuffer(packBuff))

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

    readNumber(): number {
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
}

export default ServerBoundPacketBuffer
