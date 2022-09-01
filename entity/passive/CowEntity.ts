import PassiveEntity from './PassiveEntity'
import { EntityType } from '../EntityType'

export default class CowEntity extends PassiveEntity {
    constructor(x: number, y: number, z: number) {
        super(EntityType.COW)
        this.setPosition(x, y, z)
    }
    
    getMaxHealth(): number {
        return 10
    }
}