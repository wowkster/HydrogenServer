import Vector from './Vector'
import BlockPos from './BlockPos'
import ChunkPos from './ChunkPos'

/**
 * Represents a World position and includes helpers for block
 * positions and transformations into other types
 */
export default class Position extends Vector {
    static get ORIGIN() {
        return new Position()
    }

    constructor(x?: number, y?: number, z?: number) {
        super(x, y, z)
    }

    get blockX() {
        return Math.floor(this.x)
    }

    get blockY() {
        return Math.floor(this.y)
    }

    get blockZ() {
        return Math.floor(this.z)
    }

    clone() {
        return new Position(this.x, this.y, this.z)
    }

    equals(other: Position) {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }

    equalsBlockPos(other: BlockPos) {
        return this.blockX === other.x && this.blockY === other.y && this.blockZ === other.z
    }

    asBlockPos() {
        return new BlockPos(this.x, this.y, this.z)
    }

    asChunkPos() {
        return new ChunkPos(this.x, this.z)
    }
}
