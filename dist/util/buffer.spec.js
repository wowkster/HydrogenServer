import PacketBuffer from "./buffer.js";
describe('PacketBuffer reads correctly', () => {
    test('Reads VarInt (0) correctly', () => {
        let buff = new PacketBuffer(Buffer.from([0x00]));
        expect(buff.readVarInt()).toBe(0);
    });
});
