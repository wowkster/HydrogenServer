// Heck to avoid circular dependency
const Entity = (await import('../Entity')).default
type Entity = InstanceType<Awaited<typeof import('../Entity')>['default']>

import { EntityType } from '../EntityType'

export default class ArmorStandEntity extends Entity {
    constructor(x: number, y: number, z: number) {
        super(EntityType.ARMOR_STAND)
        this.setPosition(x, y, z)
    }
}