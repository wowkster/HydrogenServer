import chalk from 'chalk'
import util from 'util'

import ServerBoundPacketBuffer from '../../ServerBoundPacketBuffer'
import C2SPacket from '../C2SPacket'

export default abstract class S2CPlayerMovementPacket extends C2SPacket {
    protected x: number = 0
    protected y: number = 0
    protected z: number = 0
    protected yaw: number = 0
    protected pitch: number = 0
    protected onGround: boolean = false

    constructor(
        packetBuffer: ServerBoundPacketBuffer,
        protected changePosition: boolean,
        protected changeLook: boolean
    ) {
        super(packetBuffer)
    }

    public getX(currentX: number) {
        return this.changePosition ? this.x : currentX
    }

    public getY(currentY: number) {
        return this.changePosition ? this.y : currentY
    }

    public getZ(currentZ: number) {
        return this.changePosition ? this.z : currentZ
    }

    public getYaw(currentYaw: number) {
        return this.changeLook ? this.yaw : currentYaw
    }

    public getPitch(currentPitch: number) {
        return this.changeLook ? this.pitch : currentPitch
    }

    public isOnGround() {
        return this.onGround
    }

    public changesPosition() {
        return this.changePosition
    }

    public changesLook() {
        return this.changeLook
    }
}

export class C2SPlayerOnGroundPacket extends S2CPlayerMovementPacket {
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer, false, false)

        this.onGround = packetBuffer.readBoolean()
    }

    [util.inspect.custom]() {
        return chalk.gray(`PlayerOnGround (${this.onGround})`)
    }
}

export class C2SPlayerPositionPacket extends S2CPlayerMovementPacket {
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer, true, false)

        this.x = packetBuffer.readDouble()
        this.y = packetBuffer.readDouble()
        this.z = packetBuffer.readDouble()
        this.onGround = packetBuffer.readBoolean()
    }

    [util.inspect.custom]() {
        const x = chalk.redBright(this.x.toFixed(1))
        const y = chalk.greenBright(this.y.toFixed(1))
        const z = chalk.blueBright(this.z.toFixed(1))

        return chalk.gray(`PlayerPosition (${x}, ${y}, ${z}, ${this.onGround})`)
    }
}

export class C2SPlayerRotationPacket extends S2CPlayerMovementPacket {
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer, false, true)

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

export class C2SPlayerPositionRotationPacket extends S2CPlayerMovementPacket {
    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer, true, true)

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
