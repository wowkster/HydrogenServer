import chalk from 'chalk'
import Client from '../client/client'
import ServerBoundPacketBuffer from '../util/ServerBoundPacketBuffer'
import C2SPacket from './C2SPacket'

export type PacketMap = Map<
    number,
    [
        new (packetBuffer: ServerBoundPacketBuffer) => C2SPacket,
        <T extends C2SPacket>(this: Client, packet: T | any) => void
    ]
>

export default abstract class PacketHandler {
    protected packetMap!: PacketMap

    constructor() {
        this.init()
    }

    protected abstract init(): void

    handle(client: Client, packetBuffer: ServerBoundPacketBuffer) {
        const { packetID } = packetBuffer
        const packetEntry = this.packetMap.get(packetID)

        if (!packetEntry) throw new UnknownPacketError(packetBuffer)

        const [Clazz, packetConsumer] = packetEntry

        const packet = new Clazz(packetBuffer)
        // console.log(chalk.cyan('Packet Length:'), packetBuffer.length)
        // console.log(chalk.cyan('Packet ID:'), packetBuffer.packetID)
        console.log(chalk.cyan('C2S Packet:'), packet)

        packetConsumer.call(client, packet)
    }
}

export class UnknownPacketError extends Error {
    packetBuffer: ServerBoundPacketBuffer

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(`Unknown Packet ID 0x${packetBuffer.packetID.toString(16)}`)
        this.packetBuffer = packetBuffer
    }
}
