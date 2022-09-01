import UUID from '../../datatypes/UUID'
import { EntityType } from '../EntityType'
import LivingEntity from '../LivingEntity'

export default abstract class PassiveEntity extends LivingEntity {
    constructor(type: EntityType, uuid?: UUID) {
        super(type, uuid)
    }
}
