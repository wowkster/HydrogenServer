import chalk from 'chalk'
import util from 'util'

import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default class C2SPlayerPositionRotationPacket extends C2SPacket {
    x: number
    y: number
    z: number
    yaw: number
    pitch: number
    onGround: boolean

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.x = packetBuffer.readDouble()
        this.y = packetBuffer.readDouble()
        this.z = packetBuffer.readDouble()
        this.yaw = packetBuffer.readFloat()
        this.pitch = packetBuffer.readFloat()
        this.onGround = packetBuffer.readBoolean()
    }

    [util.inspect.custom]() {
        const x = chalk.redBright(this.x.toFixed(1))
        const y = chalk.greenBright(this.y.toFixed(1))
        const z = chalk.blueBright(this.z.toFixed(1))

        const yaw = chalk.magentaBright(this.yaw.toFixed(1))
        const pitch = chalk.yellowBright(this.pitch.toFixed(1))

        return chalk.gray(`PlayerPositionRotation (${x}, ${y}, ${z}, ${yaw}, ${pitch})`)
    }
}
