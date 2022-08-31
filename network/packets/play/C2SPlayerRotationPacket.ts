import chalk from 'chalk'
import util from 'util'

import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2SPlayerRotationPacket extends C2SPacket {
    yaw: number
    pitch: number
    onGround: boolean

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.yaw = packetBuffer.readFloat()
        this.pitch = packetBuffer.readFloat()
        this.onGround = packetBuffer.readBoolean()
    }

    [util.inspect.custom]() {
        const yaw = chalk.magentaBright(this.yaw.toFixed(1))
        const pitch = chalk.yellowBright(this.pitch.toFixed(1))

        return chalk.gray(`PlayerRotation (${yaw}, ${pitch})`)
    }
}
