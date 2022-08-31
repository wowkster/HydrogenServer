import UUID from '../../../datatypes/UUID'
import { EntityTypes } from '../../../registry/EntityTypes'
import S2CPacket from '../S2CPacket'

export default class S2CSpawnLivingEntityPacket extends S2CPacket {
    constructor(
        readonly entityId: number,
        readonly uuid: UUID,
        readonly type: EntityTypes,
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
            case EntityTypes.PLAYER:
                throw new Error('Players should only be spawned with the S2CSpawnPlayer packet!')
            case EntityTypes.EXPERIENCE_ORB:
                throw new Error('Experience orbs should only be spawned with the S2CSpawnExperienceOrb packet!')
            case EntityTypes.PAINTING:
                throw new Error('Paintings should only be spawned with the S2CSpawnPainting packet!')
            case EntityTypes.MARKER:
                throw new Error(
                    'Marker entities should never be spawned! (See https://minecraft.fandom.com/wiki/Marker)'
                )
            case EntityTypes.AREA_EFFECT_CLOUD:
            case EntityTypes.ARROW:
            case EntityTypes.BOAT:
            case EntityTypes.DRAGON_FIREBALL:
            case EntityTypes.END_CRYSTAL:
            case EntityTypes.EVOKER_FANGS:
            case EntityTypes.EYE_OF_ENDER:
            case EntityTypes.FALLING_BLOCK:
            case EntityTypes.FIREWORK_ROCKET:
            case EntityTypes.GLOW_ITEM_FRAME:
            case EntityTypes.ITEM:
            case EntityTypes.ITEM_FRAME:
            case EntityTypes.FIREBALL:
            case EntityTypes.LEASH_KNOT:
            case EntityTypes.LIGHTNING_BOLT:
            case EntityTypes.LLAMA_SPIT:
            case EntityTypes.MINECART:
            case EntityTypes.CHEST_MINECART:
            case EntityTypes.COMMAND_BLOCK_MINECART:
            case EntityTypes.FURNACE_MINECART:
            case EntityTypes.HOPPER_MINECART:
            case EntityTypes.SPAWNER_MINECART:
            case EntityTypes.TNT_MINECART:
            case EntityTypes.TNT:
            case EntityTypes.SHULKER_BULLET:
            case EntityTypes.SMALL_FIREBALL:
            case EntityTypes.SNOWBALL:
            case EntityTypes.SPECTRAL_ARROW:
            case EntityTypes.EGG:
            case EntityTypes.ENDER_PEARL:
            case EntityTypes.EXPERIENCE_BOTTLE:
            case EntityTypes.POTION:
            case EntityTypes.TRIDENT:
            case EntityTypes.WITHER_SKULL:
            case EntityTypes.FISHING_BOBBER:
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
}
