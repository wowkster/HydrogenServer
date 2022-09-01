import Vector from '../datatypes/Vector'
import UUID from '../datatypes/UUID'
import { EntityType } from './EntityType'
import Position from '../datatypes/Position'
import EntityPosition from '../datatypes/EntityPosition'
import S2CSpawnEntityPacket from '../network/packets/play/S2CSpawnEntityPacket';
import S2CPacket from '../network/packets/S2CPacket';

export default class Entity {
    static ENTITY_COUNTER = 0

    readonly id: number
    readonly uuid: UUID

    readonly type: EntityType

    prevPosition: EntityPosition
    position: EntityPosition
    velocity: Vector
    onGround: boolean = false

    glowing: boolean = false
    invulnerable: boolean = false
    fireTicks: number = 0

    // TODO Entity meta data tracking

    constructor(type: EntityType, uuid?: UUID) {
        this.id = Entity.ENTITY_COUNTER++
        this.uuid = uuid ?? new UUID()

        this.type = type

        this.prevPosition = new EntityPosition()
        this.position = new EntityPosition()
        this.velocity = new Vector()
    }

    public tick() {
        // Check if was teleported
        this.position.addVec(this.velocity)

        // If position has changed since last tick, send correct position packet

        const posChanged = !this.position.asPosition().equals(this.prevPosition.asPosition())
        const rotationChanged = !this.position.equalsRotation(this.prevPosition)

        if (posChanged && rotationChanged) {
            // Send position rotation packet
        } else if (posChanged) {
            // Send position packet
        } else if (rotationChanged) {
            // Send rotation packet
        }
    }

    public isInRange(other: Entity, radius: number) {
        const d = other.position.x - this.position.x
        const e = other.position.y - this.position.y
        const f = other.position.z - this.position.z
        return d * d + e * e + f * f < radius * radius
    }

    protected setRotation(yaw: number, pitch: number) {
        this.position.yaw = yaw % 360.0
        this.position.pitch = pitch % 360.0
    }

    public setPosition(x: number, y: number, z: number) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }

    public setPositionFromVec(pos: Position | Vector) {
        this.position.x = pos.x
        this.position.y = pos.y
        this.position.z = pos.z
    }

    get x() {
        return this.position.x
    }

    get y() {
        return this.position.y
    }

    get z() {
        return this.position.z
    }

    get pitch() {
        return this.position.pitch
    }

    get yaw() {
        return this.position.yaw
    }

    get world() {
        return this.position.world
    }

    createSpawnPacket(): S2CPacket {
        return S2CSpawnEntityPacket.fromEntity(this)
    }
}
