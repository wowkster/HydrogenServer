import S2CPacket from '../S2CPacket'

import { Entity } from '../../..'

export default class S2CEntityVelocityPacket extends S2CPacket {
    constructor(readonly entityId: number, readonly vx: number, readonly vy: number, readonly vz: number) {
        super(0x4f)

        this.writeVarInt(entityId)
        this.writeShort(vx / 8000)
        this.writeShort(vy / 8000)
        this.writeShort(vz / 8000)
    }

    static fromEntity(entity: Entity) {
        return new S2CEntityVelocityPacket(entity.id, entity.velocity.x, entity.velocity.y, entity.velocity.z)
    }
}
