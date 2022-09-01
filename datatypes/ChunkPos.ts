export default class ChunkPos {
    private _x: number = 0
    private _z: number = 0

    constructor(x = 0, z = 0) {
        this.x = x
        this.z = z
    }

    get x() {
        return this._x
    }

    get z() {
        return this._z
    }

    set x(x: number) {
        this._x = Math.floor(x / 16)
    }

    set z(z: number) {
        this._z = Math.floor(z / 16)
    }

    equals(other: ChunkPos) {
        return this.x === other.x && this.z === other.z
    }
}
