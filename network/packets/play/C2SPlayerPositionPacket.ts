import chalk from 'chalk'
import util from 'util'

import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

/**
 * https://wiki.vg/Protocol#Player_Position
 */
export default class C2SPlayerPositionPacket extends C2SPacket {
    x: number
    y: number
    z: number
    onGround: boolean

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        this.x = packetBuffer.readDouble()
        this.y = packetBuffer.readDouble()
        this.z = packetBuffer.readDouble()
        this.onGround = packetBuffer.readBoolean()
    }

    [util.inspect.custom]() {
        const x = chalk.redBright(this.x.toFixed(1))
        const y = chalk.greenBright(this.y.toFixed(1))
        const z = chalk.blueBright(this.z.toFixed(1))

        return chalk.gray(`PlayerPosition (${x}, ${y}, ${z})`)
    }
}
