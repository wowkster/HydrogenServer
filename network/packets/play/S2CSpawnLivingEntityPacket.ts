import UUID from '../../../datatypes/UUID'
import { EntityType } from '../../../entity/EntityType'
import S2CPacket from '../S2CPacket'
import LivingEntity from '../../../entity/LivingEntity'

export default class S2CSpawnLivingEntityPacket extends S2CPacket {
    constructor(
        readonly entityId: number,
        readonly uuid: UUID,
        readonly type: EntityType,
        readonly x: number,
        readonly y: number,
        readonly z: number,
        readonly yaw: number,
        readonly pitch: number,
        readonly headYaw: number,
        readonly vx: number,
        readonly vy: number,
        readonly vz: number
    ) {
        super(0x02)

        switch (type) {
            case EntityType.PLAYER:
                throw new Error('Players should only be spawned with the S2CSpawnPlayer packet!')
            case EntityType.EXPERIENCE_ORB:
                throw new Error('Experience orbs should only be spawned with the S2CSpawnExperienceOrb packet!')
            case EntityType.PAINTING:
                throw new Error('Paintings should only be spawned with the S2CSpawnPainting packet!')
            case EntityType.MARKER:
                throw new Error(
                    'Marker entities should never be spawned! (See https://minecraft.fandom.com/wiki/Marker)'
                )
            case EntityType.AREA_EFFECT_CLOUD:
            case EntityType.ARROW:
            case EntityType.BOAT:
            case EntityType.DRAGON_FIREBALL:
            case EntityType.END_CRYSTAL:
            case EntityType.EVOKER_FANGS:
            case EntityType.EYE_OF_ENDER:
            case EntityType.FALLING_BLOCK:
            case EntityType.FIREWORK_ROCKET:
            case EntityType.GLOW_ITEM_FRAME:
            case EntityType.ITEM:
            case EntityType.ITEM_FRAME:
            case EntityType.FIREBALL:
            case EntityType.LEASH_KNOT:
            case EntityType.LIGHTNING_BOLT:
            case EntityType.LLAMA_SPIT:
            case EntityType.MINECART:
            case EntityType.CHEST_MINECART:
            case EntityType.COMMAND_BLOCK_MINECART:
            case EntityType.FURNACE_MINECART:
            case EntityType.HOPPER_MINECART:
            case EntityType.SPAWNER_MINECART:
            case EntityType.TNT_MINECART:
            case EntityType.TNT:
            case EntityType.SHULKER_BULLET:
            case EntityType.SMALL_FIREBALL:
            case EntityType.SNOWBALL:
            case EntityType.SPECTRAL_ARROW:
            case EntityType.EGG:
            case EntityType.ENDER_PEARL:
            case EntityType.EXPERIENCE_BOTTLE:
            case EntityType.POTION:
            case EntityType.TRIDENT:
            case EntityType.WITHER_SKULL:
            case EntityType.FISHING_BOBBER:
                throw new Error('Non-living entities should only be spawned with S2CSpawnEntityPacket!')
        }

        this.packetBuffer.writeVarInt(entityId)
        this.packetBuffer.writeUUID(uuid)
        this.packetBuffer.writeVarInt(type)
        this.packetBuffer.writeDouble(x)
        this.packetBuffer.writeDouble(y)
        this.packetBuffer.writeDouble(z)
        this.packetBuffer.writeAngle(pitch)
        this.packetBuffer.writeAngle(yaw)
        this.packetBuffer.writeAngle(headYaw)
        this.packetBuffer.writeShort(vx)
        this.packetBuffer.writeShort(vy)
        this.packetBuffer.writeShort(vz)
    }

    static fromEntity(entity: LivingEntity) {
        return new S2CSpawnLivingEntityPacket(
            entity.id,
            entity.uuid,
            entity.type,
            entity.x,
            entity.y,
            entity.z,
            entity.yaw,
            entity.pitch,
            entity.headYaw,
            entity.velocity.x,
            entity.velocity.y,
            entity.velocity.z
        )
    }
}
