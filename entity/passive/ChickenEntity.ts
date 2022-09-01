import PassiveEntity from './PassiveEntity'
import { EntityType } from '../EntityType'

export default class ChickenEntity extends PassiveEntity {
    constructor(x: number, y: number, z: number) {
        super(EntityType.CHICKEN)
        this.setPosition(x, y, z)
    }
    
    getMaxHealth(): number {
        return 4
    }
}