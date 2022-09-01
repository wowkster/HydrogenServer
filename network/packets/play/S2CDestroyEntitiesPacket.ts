import S2CPacket from '../S2CPacket'
import Entity from '../../../entity/Entity'

export default class S2CDestroyEntitiesPacket extends S2CPacket {
    constructor(entityIds: number[]) {
        super(0x3a)

        this.packetBuffer.writeVarInt(entityIds.length)

        for (const id of entityIds) {
            this.packetBuffer.writeVarInt(id)
        }
    }

    static fromEntities(entities: Entity[]) {
        return new S2CDestroyEntitiesPacket(entities.map(e => e.id))
    }

    static fromEntity(entity: Entity) {
        return new S2CDestroyEntitiesPacket([entity.id])
    }
}
