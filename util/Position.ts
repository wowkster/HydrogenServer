import Vector from './Vector'

export default class Position {
    static get ORIGIN() {
        return new Position()
    }

    constructor(public pos: Vector = new Vector(), public yaw: number = 0, public pitch: number = 0) {}

    get x() {
        return this.pos.x
    }

    get blockX() {
        return Math.floor(this.pos.x)
    }

    get y() {
        return this.pos.y
    }

    get blockY() {
        return Math.floor(this.pos.y)
    }

    get z() {
        return this.pos.z
    }

    get blockZ() {
        return Math.floor(this.pos.z)
    }
}
