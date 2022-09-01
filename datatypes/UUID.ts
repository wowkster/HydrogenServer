import * as uuid from 'uuid'

export type UUIDResolvable = string | Buffer | Uint8Array | UUID

export default class UUID {
    public static ZERO = new UUID('00000000-0000-0000-0000-000000000000')

    private readonly value!: string

    constructor(uuidLike?: UUIDResolvable) {
        if (!uuidLike) {
            return new UUID(uuid.v4())
        }

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
