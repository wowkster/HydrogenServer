import ChunkPos from './ChunkPos'

export default class BlockPos {
    static get ZERO() {
        return new BlockPos()
    }

    private _x: number = 0
    private _y: number = 0
    private _z: number = 0

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get z() {
        return this._z
    }

    set x(x: number) {
        this._x = Math.floor(x)
    }

    set y(y: number) {
        this._y = Math.floor(y)
    }

    set z(z: number) {
        this._z = Math.floor(z)
    }

    asChunkPos() {
        return new ChunkPos(this.x, this.z)
    }

    equals(other: BlockPos) {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }
}
