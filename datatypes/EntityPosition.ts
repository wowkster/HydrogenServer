import Position from './Position'
import World from '../world/World'

/**
 * Represents an entity's position in the world
 */
export default class EntityPosition extends Position {
    static get ORIGIN() {
        return new EntityPosition()
    }

    world: World

    constructor(x?: number, y?: number, z?: number, public yaw: number = 0, public pitch: number = 0) {
        super(x, y, z)

        this.world = World.OVERWORLD
    }

    clone() {
        return new EntityPosition(this.x, this.y, this.z, this.yaw, this.pitch)
    }

    equals(other: EntityPosition) {
        return (
            this.x === other.x &&
            this.y === other.y &&
            this.z === other.z &&
            this.yaw === other.yaw &&
            this.pitch === other.pitch &&
            this.world === other.world
        )
    }

    equalsPosition(other: EntityPosition) {
        return this.x === other.x && this.y === other.y && this.z === other.z 
    }

    equalsRotation(other: EntityPosition) {
        return this.yaw === other.yaw && this.pitch === other.pitch
    }

    asPosition() {
        return new Position(this.x, this.y, this.z)
    }
}
