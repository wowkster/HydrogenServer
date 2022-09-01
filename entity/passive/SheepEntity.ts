import PassiveEntity from './PassiveEntity'
import { EntityType } from '../EntityType'

export default class SheepEntity extends PassiveEntity {
    constructor(x: number, y: number, z: number) {
        super(EntityType.SHEEP)
        this.setPosition(x, y, z)
    }
    
    getMaxHealth(): number {
        return 10
    }
}