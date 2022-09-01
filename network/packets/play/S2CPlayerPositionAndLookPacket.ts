import Position from '../../../datatypes/Position'
import Vector from '../../../datatypes/Vector'
import S2CPacket from '../S2CPacket'
import EntityPosition from '../../../datatypes/EntityPosition';

export default class S2CPlayerPositionAndLookPacket extends S2CPacket {
    static RELATIVE_BIT_MASK = 0x01 | 0x02 | 0x04 | 0x08 | 0x10

    constructor(
        readonly x: number,
        readonly y: number,
        readonly z: number,
        readonly yaw: number,
        readonly pitch: number,
        readonly dismountVehicle: boolean = false,
        readonly relative: boolean = false
    ) {
        super(0x38)

        this.packetBuffer.writeDouble(x)
        this.packetBuffer.writeDouble(y)
        this.packetBuffer.writeDouble(z)

        // ! TODO Normalize Yaw & Pitch
        this.packetBuffer.writeFloat(yaw)
        this.packetBuffer.writeFloat(pitch)
        this.packetBuffer.writeByte(relative ? S2CPlayerPositionAndLookPacket.RELATIVE_BIT_MASK : 0x00)

        // ! TODO Store Teleport ID for verification
        this.packetBuffer.writeVarInt(0)

        this.packetBuffer.writeBoolean(dismountVehicle)
    }

    static fromPosition(pos: EntityPosition, dismountVehicle: boolean = false, relative: boolean = false) {
        return new S2CPlayerPositionAndLookPacket(pos.x, pos.y, pos.z, pos.yaw, pos.pitch, dismountVehicle, relative)
    }

    static fromVec(
        vec: Vector,
        yaw: number,
        pitch: number,
        dismountVehicle: boolean = false,
        relative: boolean = false
    ) {
        return new S2CPlayerPositionAndLookPacket(vec.x, vec.y, vec.z, yaw, pitch, dismountVehicle, relative)
    }
}
