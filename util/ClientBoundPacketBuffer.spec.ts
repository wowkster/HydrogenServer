import ServerBoundPacketBuffer from './ServerBoundPacketBuffer'
import ClientBoundPacketBuffer from './ClientBoundPacketBuffer'
import Vector from './Vector'
import BitSet from './BitSet'

describe('ClientBoundPacketBuffer writes correctly', () => {
    it('Writes VarInt (0) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(0)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(0)
    })

    it('Writes VarInt (1) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(1)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(1)
    })

    it('Writes VarInt (2) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(2)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(2)
    })

    it('Writes VarInt (127) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(127)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(127)
    })

    it('Writes VarInt (128) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(128)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(128)
    })

    it('Writes VarInt (255) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(255)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(255)
    })

    it('Writes VarInt (25565) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(25565)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(25565)
    })

    it('Writes VarInt (2097151) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(2097151)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(2097151)
    })

    it('Writes VarInt (2147483647) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(2147483647)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(2147483647)
    })

    it('Writes VarInt (-1) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(-1)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(-1)
    })

    it('Writes VarInt (-2147483648) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarInt(-2147483648)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarInt()).toBe(-2147483648)
    })

    it('Writes VarLong (0) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(0n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(0n)
    })

    it('Writes VarLong (1) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(1n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(1n)
    })

    it('Writes VarLong (2) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(2n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(2n)
    })

    it('Writes VarLong (127) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(127n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(127n)
    })

    it('Writes VarLong (128) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(128n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(128n)
    })

    it('Writes VarLong (255) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(255n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(255n)
    })

    it('Writes VarLong (2147483647) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(2147483647n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(2147483647n)
    })

    it('Writes VarLong (9223372036854775807) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(9223372036854775807n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(9223372036854775807n)
    })

    it('Writes VarLong (-1) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(-1n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(-1n)
    })

    it('Writes VarLong (-2147483648) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(-2147483648n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(-2147483648n)
    })

    it('Writes VarLong (-9223372036854775808) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeVarLong(-9223372036854775808n)
        expect(new ServerBoundPacketBuffer(buff.serialize()).readVarLong()).toBe(-9223372036854775808n)
    })

    it('Writes Position (0, 0, 1) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writePosition(new Vector(0, 0, 1))
        expect(new ServerBoundPacketBuffer(buff.serialize()).readPosition()).toEqual(new Vector(0, 0, 1))
    })
    
    it('Writes Position (12, 4, 1) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writePosition(new Vector(12, 4, 1))
        expect(new ServerBoundPacketBuffer(buff.serialize()).readPosition()).toEqual(new Vector(12, 4, 1))
    })
    
    it('Writes Position (3, -5, 0) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writePosition(new Vector(3, -5, 0))
        expect(new ServerBoundPacketBuffer(buff.serialize()).readPosition()).toEqual(new Vector(3, -5, 0))
    })

    it('Writes BitSet (00000000) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeBitSet(new BitSet('00000000'))

        const serialized = buff.serialize(true)

        expect(serialized.length).toBe(1)
        expect(serialized.toString('hex')).toEqual('00')
    })

    it('Writes BitSet (11110000) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeBitSet(new BitSet('11110000'))

        const serialized = buff.serialize(true)

        expect(serialized.length).toBe(9)
        expect(serialized.toString('hex')).toEqual('01' + '00000000000000f0')
    })

    it('Writes BitSet (11110000, 00000000 00000000 00000000 00000000 00000000 00000000 00000000 11110000) Correctly', () => {
        let buff = new ClientBoundPacketBuffer()
        buff.writeBitSet(new BitSet('11110000' + '0000000000000000000000000000000000000000000000000000000011110000'))

        const serialized = buff.serialize(true)

        expect(serialized.length).toBe(17)
        expect(serialized.toString('hex')).toEqual('02' + '00000000000000f0' + '00000000000000f0')
    })
})
