import ServerBoundPacketBuffer from './ServerBoundPacketBuffer'

describe('ServerBoundPacketBuffer reads correctly', () => {
    test('Reads VarInt (0) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x00]), true).readVarInt()).toBe(0)
    })

    test('Reads VarInt (1) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x01]), true).readVarInt()).toBe(1)
    })

    test('Reads VarInt (2) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x02]), true).readVarInt()).toBe(2)
    })

    test('Reads VarInt (127) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x7f]), true).readVarInt()).toBe(127)
    })

    test('Reads VarInt (128) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x80, 0x01]), true).readVarInt()).toBe(128)
    })

    test('Reads VarInt (255) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0xff, 0x01]), true).readVarInt()).toBe(255)
    })

    test('Reads VarInt (25565) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0xdd, 0xc7, 0x01]), true).readVarInt()).toBe(25565)
    })

    test('Reads VarInt (2097151) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0xff, 0xff, 0x7f]), true).readVarInt()).toBe(2097151)
    })

    test('Reads VarInt (2147483647) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07]), true).readVarInt()).toBe(
            2147483647
        )
    })

    test('Reads VarInt (-1) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]), true).readVarInt()).toBe(-1)
    })

    test('Reads VarInt (-2147483648) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x80, 0x80, 0x80, 0x80, 0x08]), true).readVarInt()).toBe(
            -2147483648
        )
    })

    test('Reads Multiple VarInts (127, 128, 2097151) correctly', () => {
        let buff = new ServerBoundPacketBuffer(Buffer.from([0x7f, 0x80, 0x01, 0xff, 0xff, 0x7f]), true)

        expect(buff.readVarInt()).toBe(127)
        expect(buff.readVarInt()).toBe(128)
        expect(buff.readVarInt()).toBe(2097151)
    })

    test('Reads VarLong (2147483647) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0xff, 0xff, 0xff, 0xff, 0x07]), true).readVarLong()).toBe(
            2147483647n
        )
    })

    test('Reads VarLong (9223372036854775807) correctly', () => {
        expect(
            new ServerBoundPacketBuffer(
                Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]),
                true
            ).readVarLong()
        ).toBe(9223372036854775807n)
    })

    test('Reads VarLong (-1) correctly', () => {
        expect(
            new ServerBoundPacketBuffer(
                Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01]),
                true
            ).readVarLong()
        ).toBe(-1n)
    })

    test('Reads VarLong (-2147483648) correctly', () => {
        expect(
            new ServerBoundPacketBuffer(
                Buffer.from([0x80, 0x80, 0x80, 0x80, 0xf8, 0xff, 0xff, 0xff, 0xff, 0x01]),
                true
            ).readVarLong()
        ).toBe(-2147483648n)
    })

    test('Reads VarLong (-9223372036854775808) correctly', () => {
        expect(
            new ServerBoundPacketBuffer(
                Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]),
                true
            ).readVarLong()
        ).toBe(-9223372036854775808n)
    })

    test('Reads Multiple VarLongs (9223372036854775807, -2147483648, -9223372036854775808) correctly', () => {
        let buff = new ServerBoundPacketBuffer(
            Buffer.from([
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f, /**/ 0x80, 0x80, 0x80, 0x80, 0xf8, 0xff, 0xff,
                0xff, 0xff, 0x01, /**/ 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01,
            ]),
            true
        )

        expect(buff.readVarLong()).toBe(9223372036854775807n)
        expect(buff.readVarLong()).toBe(-2147483648n)
        expect(buff.readVarLong()).toBe(-9223372036854775808n)
    })

    test('Reads Boolean (false) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x00]), true).readBoolean()).toBe(false)
    })

    test('Reads Boolean (true) correctly', () => {
        expect(new ServerBoundPacketBuffer(Buffer.from([0x01]), true).readBoolean()).toBe(true)
    })

    test('Reads Multiple Booleans (false, true, false) correctly', () => {
        let buff = new ServerBoundPacketBuffer(Buffer.from([0x00, 0x01, 0x00]), true)

        expect(buff.readBoolean()).toBe(false)
        expect(buff.readBoolean()).toBe(true)
        expect(buff.readBoolean()).toBe(false)
    })
})
