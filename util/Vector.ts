export default class Vector {
    x: number
    y: number
    z: number

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    equal(other: Vector) {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }
}
