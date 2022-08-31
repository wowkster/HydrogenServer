import BitSet from "./BitSet"

/**
 * These tests come from the official documentation:
 * https://wiki.vg/index.php?title=Protocol&oldid=17499#BitSet
 * https://docs.oracle.com/javase/8/docs/api/java/util/BitSet.html#toLongArray--
 */

describe('BitSet', () => {
    it ('toLongArray ()', () => {
        const bitset = new BitSet('0')
        
        const longs = bitset.toLongArray()

        expect(longs.length).toBe(0)
    })   

    it ('toLongArray (11110000)', () => {
        const bitset = new BitSet('11110000')
        
        const longs = bitset.toLongArray()

        expect((longs[Math.floor(0 / 64)] & (1n << BigInt(0 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(1 / 64)] & (1n << BigInt(1 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(2 / 64)] & (1n << BigInt(2 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(3 / 64)] & (1n << BigInt(3 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(4 / 64)] & (1n << BigInt(4 % 64))) != 0n).toBe(true)
        expect((longs[Math.floor(5 / 64)] & (1n << BigInt(5 % 64))) != 0n).toBe(true)
        expect((longs[Math.floor(6 / 64)] & (1n << BigInt(6 % 64))) != 0n).toBe(true)
        expect((longs[Math.floor(7 / 64)] & (1n << BigInt(7 % 64))) != 0n).toBe(true)
    })   
    
    it ('toLongArray (11110000, 00000000 00000000 00000000 00000000 00000000 00000000 00000000 11110000)', () => {
        const bitset = new BitSet('11110000' + '0000000000000000000000000000000000000000000000000000000011110000')
        
        const longs = bitset.toLongArray()

        expect((longs[Math.floor(0 / 64)] & (1n << BigInt(0 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(1 / 64)] & (1n << BigInt(1 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(2 / 64)] & (1n << BigInt(2 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(3 / 64)] & (1n << BigInt(3 % 64))) != 0n).toBe(false)
        expect((longs[Math.floor(4 / 64)] & (1n << BigInt(4 % 64))) != 0n).toBe(true)
        expect((longs[Math.floor(5 / 64)] & (1n << BigInt(5 % 64))) != 0n).toBe(true)
        expect((longs[Math.floor(6 / 64)] & (1n << BigInt(6 % 64))) != 0n).toBe(true)
        expect((longs[Math.floor(7 / 64)] & (1n << BigInt(7 % 64))) != 0n).toBe(true)

        expect((longs[Math.floor((64 + 0) / 64)] & (1n << BigInt((64 + 0) % 64))) != 0n).toBe(false)
        expect((longs[Math.floor((64 + 1) / 64)] & (1n << BigInt((64 + 1) % 64))) != 0n).toBe(false)
        expect((longs[Math.floor((64 + 2) / 64)] & (1n << BigInt((64 + 2) % 64))) != 0n).toBe(false)
        expect((longs[Math.floor((64 + 3) / 64)] & (1n << BigInt((64 + 3) % 64))) != 0n).toBe(false)
        expect((longs[Math.floor((64 + 4) / 64)] & (1n << BigInt((64 + 4) % 64))) != 0n).toBe(true)
        expect((longs[Math.floor((64 + 5) / 64)] & (1n << BigInt((64 + 5) % 64))) != 0n).toBe(true)
        expect((longs[Math.floor((64 + 6) / 64)] & (1n << BigInt((64 + 6) % 64))) != 0n).toBe(true)
        expect((longs[Math.floor((64 + 7) / 64)] & (1n << BigInt((64 + 7) % 64))) != 0n).toBe(true)
    })   
})