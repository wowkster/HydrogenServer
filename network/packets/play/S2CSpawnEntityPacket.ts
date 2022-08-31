import UUID from '../../../datatypes/UUID'
import { EntityTypes } from '../../../registry/EntityTypes'
import S2CPacket from '../S2CPacket'

enum ItemFrameOrientation {
    DOWN = 0,
    UP = 1,
    NORTH = 2,
    SOUTH = 3,
    WEST = 4,
    EAST = 5,
}

type FallingBlockStateID = number
type FishFloatOwnerID = number
type ProjectileOwnerID = number

type SpawnPacketData = ItemFrameOrientation | FallingBlockStateID | FishFloatOwnerID | ProjectileOwnerID

export default class S2CSpawnEntityPacket extends S2CPacket {
    constructor(
        readonly entityId: number,
        readonly uuid: UUID,
        readonly type: EntityTypes,
        readonly x: number,
        readonly y: number,
        readonly z: number,
        readonly pitch: number,
        readonly yaw: number,
        readonly data: SpawnPacketData,
        readonly vx: number,
        readonly vy: number,
        readonly vz: number
    ) {
        super(0x00)

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
        }

        this.packetBuffer.writeVarInt(entityId)
        this.packetBuffer.writeUUID(uuid)
        this.packetBuffer.writeVarInt(type)
        this.packetBuffer.writeDouble(x)
        this.packetBuffer.writeDouble(y)
        this.packetBuffer.writeDouble(z)
        this.packetBuffer.writeAngle(pitch)
        this.packetBuffer.writeAngle(yaw)
        this.packetBuffer.writeInt(data)
        this.packetBuffer.writeShort(vx)
        this.packetBuffer.writeShort(vy)
        this.packetBuffer.writeShort(vz)
    }
}
