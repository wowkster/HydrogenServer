class PacketBuffer {
    constructor(buffer) {
        this.position = 0;
        this.buffer = buffer ?? Buffer.from([]);
    }
    readVarInt() {
        let value = 0;
        let position = 0;
        let currentByte;
        while (true) {
            currentByte = this.buffer[position++];
            value |= (currentByte & PacketBuffer.SEGMENT_BITS) << position;
            if ((currentByte & PacketBuffer.CONTINUE_BIT) == 0)
                break;
            position += 7;
            if (position >= 32)
                throw new Error('VarInt is too big');
        }
        return value;
    }
}
PacketBuffer.SEGMENT_BITS = 0x7f;
PacketBuffer.CONTINUE_BIT = 0x80;
export default PacketBuffer;
