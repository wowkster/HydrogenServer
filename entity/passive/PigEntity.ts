import PassiveEntity from './PassiveEntity'
import { EntityType } from '../EntityType'

export default class PigEntity extends PassiveEntity {
    constructor(x: number, y: number, z: number) {
        super(EntityType.PIG)
        this.setPosition(x, y, z)
    }
    
    getMaxHealth(): number {
        return 10
    }
}
