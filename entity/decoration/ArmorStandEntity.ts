// Heck to avoid circular dependency
import { Entity } from '../..'
import { EntityType } from '../EntityType'

export default class ArmorStandEntity extends Entity {
    constructor(x: number, y: number, z: number) {
        super(EntityType.ARMOR_STAND)
        this.setPosition(x, y, z)
    }
}
