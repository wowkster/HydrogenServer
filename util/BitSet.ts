import BitSet from 'bitset'

declare module 'bitset' {
    interface BitSet {
        toLongArray(): bigint[]
    }
}

BitSet.prototype.toLongArray = function () {
    const msb = this.msb()

    if (msb === Infinity) return []

    const ints = new Array(msb + 1).fill(0).map((_, i) => this.get(i))

    const longs: bigint[] = []
    for (let i = 0; i < ints.length; i += 64) {
        const slice = ints.slice(i, i + 64)

        const long = slice.reduce((acc, curr, index) => {
            if (!curr) return acc
            acc |= 1n << BigInt(index)
            return acc
        }, 0n)
        longs.push(long)
    }

    return longs
}

export default BitSet
