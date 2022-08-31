import util from 'util'
import chalk from 'chalk'

import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'

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