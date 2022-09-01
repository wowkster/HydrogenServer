import Player from '../../../entity/player/Player'
import S2CPacket from '../S2CPacket'
import UUID from '../../../datatypes/UUID'

export default class S2CSpawnPlayerPacket extends S2CPacket {
    constructor(
        readonly id: number,
        readonly uuid: UUID,
        readonly x: number,
        readonly y: number,
        readonly z: number,
        readonly yaw: number,
        readonly pitch: number
    ) {
        super(0x04)

        this.packetBuffer.writeVarInt(id)
        this.packetBuffer.writeUUID(uuid)
        this.packetBuffer.writeDouble(x)
        this.packetBuffer.writeDouble(y)
        this.packetBuffer.writeDouble(z)
        this.packetBuffer.writeAngle(yaw)
        this.packetBuffer.writeAngle(pitch)
    }

    static fromPlayer(player: Player): S2CSpawnPlayerPacket {
        return new S2CSpawnPlayerPacket(player.id, player.uuid, player.x, player.y, player.z, player.yaw, player.pitch)
    }
}
