import * as uuid from 'uuid'

export type UUIDResolvable = string | Buffer | Uint8Array | UUID

export default class UUID {
    private readonly value: string

    constructor(uuidLike: UUIDResolvable) {
        if (typeof uuidLike === 'string') {
            if (!uuid.validate(uuidLike)) throw new Error('Invalid UUID!')
            this.value = uuidLike
            return
        }

        if (uuidLike instanceof UUID) {
            this.value = uuidLike.value
            return
        }

        if (uuidLike.length != 16) throw new Error('Invalid UUID Buffer!')

        this.value = uuid.stringify(uuidLike)
    }

    equals(other: UUIDResolvable) {
        return this.value === new UUID(other).value
    }

    serialize(): Uint8Array {
        return uuid.parse(this.value) as Uint8Array
    }

    stringify() {
        return this.value
    }

    stringifyCompact() {
        return this.value.replace(/\-/g, '')
    }

    static serialize(uuid: UUIDResolvable): Uint8Array {
        return new UUID(uuid).serialize()
    }
}
