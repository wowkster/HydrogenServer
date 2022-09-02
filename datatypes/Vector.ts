export default class Vector {
    x: number
    y: number
    z: number

    static get ZERO() {
        return new Vector()
    }

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    equals(other: Vector) {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }

    clone() {
        return new Vector(this.x, this.y, this.z)
    }

    add(x: number, y: number, z: number) {
        this.x += x
        this.y += y
        this.z += z
        return this
    }

    addVec(vec: Vector) {
        this.x += vec.x
        this.y += vec.y
        this.z += vec.z
        return this
    }

    cloneAdd(x: number, y: number, z: number) {
        return this.clone().add(x, y, z)
    }

    sub(x: number, y: number, z: number) {
        this.x -= x
        this.y -= y
        this.z -= z
        return this
    }

    cloneSub(x: number, y: number, z: number) {
        return this.clone().sub(x, y, z)
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    squaredDistanceTo(other: Vector) {
        const d = other.x - this.x
        const e = other.y - this.y
        const f = other.z - this.z
        return d * d + e * e + f * f
    }

    distanceTo(other: Vector) {
        return Math.sqrt(this.squaredDistanceTo(other))
    }
}
