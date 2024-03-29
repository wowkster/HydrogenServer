import chalk from 'chalk'

import Client from '../../client/Client'
import C2SPacket from '../packets/C2SPacket'
import S2CLoginDisconnectPacket from '../packets/login/S2CLoginDisconnectPacket'
import ServerBoundPacketBuffer from '../ServerBoundPacketBuffer'

export type PacketMap = Map<
    number,
    [new (packetBuffer: ServerBoundPacketBuffer) => C2SPacket, <T extends C2SPacket>(packet: T | any) => void]
>

export default abstract class AbstractPacketHandler {
    protected packetMap!: PacketMap

    constructor(public readonly client: Client) {
        this.init()
    }

    protected abstract init(): void
    public tick(): void {}
    public onDisconnected(): void {}

    public disconnect(reason: string): void {
        this.client.sendPacket(
            new S2CLoginDisconnectPacket({
                text: reason,
            })
        )
        this.client.conn.destroy()
    }

    handle(packetBuffer: ServerBoundPacketBuffer) {
        const { packetID } = packetBuffer
        const packetEntry = this.packetMap.get(packetID)

        if (!packetEntry) throw new UnknownPacketError(packetBuffer)

        const [Clazz, packetConsumer] = packetEntry

        const packet = new Clazz(packetBuffer)
        // console.log(chalk.cyan('Packet Length:'), packetBuffer.length)
        // console.log(chalk.cyan('Packet ID:'), packetBuffer.packetID)
        console.log(chalk.cyan('C2S Packet:'), packet)

        packetConsumer.call(this, packet)
    }
}

export class UnknownPacketError extends Error {
    packetBuffer: ServerBoundPacketBuffer

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(`Unknown Packet ID 0x${packetBuffer.packetID.toString(16)}`)
        this.packetBuffer = packetBuffer
    }
}
