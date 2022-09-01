import UUID from '../datatypes/UUID';
import S2CSpawnLivingEntityPacket from '../network/packets/play/S2CSpawnLivingEntityPacket';
import S2CPacket from '../network/packets/S2CPacket';
import Entity from './Entity';
import { EntityType } from './EntityType';

export default abstract class LivingEntity extends Entity {
    health: number = this.getMaxHealth()
    headYaw: number = 0

    constructor(type: EntityType, uuid?: UUID) {
        super(type, uuid)
    }

    abstract getMaxHealth(): number;

    createSpawnPacket(): S2CPacket {
        return S2CSpawnLivingEntityPacket.fromEntity(this)
    }
}
