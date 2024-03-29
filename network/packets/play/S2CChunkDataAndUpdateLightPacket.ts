import nbt, { NBT } from 'prismarine-nbt'

import BitSet from '../../../datatypes/BitSet'
import Position from '../../../datatypes/Position'
import { Block } from '../../../registry/Block'
import ClientBoundPacketBuffer from '../../ClientBoundPacketBuffer'
import S2CPacket from '../S2CPacket'
import { BlockState } from '../../../registry/BlockState';

interface ChunkData {
    readonly heightMaps: NBT
    readonly blockData: Buffer
    readonly blockEntities: BlockEntity[]
}

interface BlockEntity {
    pos: Position
    type: number
    data: NBT
}

interface LightData {
    readonly trustEdges: boolean
    readonly skyLightMask: BitSet
    readonly blockLightMask: BitSet
    readonly emptySkyLightMask: BitSet
    readonly emptyBlockLightMask: BitSet
    readonly skyLightSections: Buffer[]
    readonly blockLightSections: Buffer[]
}

export default class S2CChunkDataAndUpdateLightPacket extends S2CPacket {
    constructor(
        readonly chunkX: number,
        readonly chunkZ: number,
        readonly chunkData: ChunkData,
        readonly lightData: LightData
    ) {
        super(0x22)

        this.packetBuffer.writeInt(chunkX)
        this.packetBuffer.writeInt(chunkZ)

        // Chunk Data
        this.packetBuffer.writeNBT(chunkData.heightMaps)

        this.packetBuffer.writeVarInt(chunkData.blockData.length)
        this.packetBuffer.writeBuffer(chunkData.blockData)

        this.packetBuffer.writeVarInt(chunkData.blockEntities.length)
        for (const blockEntity of chunkData.blockEntities) {
            const packedXZ = ((blockEntity.pos.blockX & 15) << 4) | (blockEntity.pos.blockZ & 15)

            this.packetBuffer.writeByte(packedXZ)
            this.packetBuffer.writeShort(blockEntity.pos.blockY)
            this.packetBuffer.writeVarInt(blockEntity.type)
            this.packetBuffer.writeNBT(blockEntity.data)
        }

        // Light Data
        this.packetBuffer.writeBoolean(lightData.trustEdges)

        this.packetBuffer.writeBitSet(lightData.skyLightMask)
        this.packetBuffer.writeBitSet(lightData.blockLightMask)

        this.packetBuffer.writeBitSet(lightData.emptySkyLightMask)
        this.packetBuffer.writeBitSet(lightData.emptyBlockLightMask)

        this.packetBuffer.writeVarInt(lightData.skyLightSections.length)
        for (const skyLightSection of lightData.skyLightSections) {
            this.packetBuffer.writeVarInt(skyLightSection.length)
            this.packetBuffer.writeBuffer(skyLightSection)
        }

        this.packetBuffer.writeVarInt(lightData.blockLightSections.length)
        for (const blockLightSection of lightData.blockLightSections) {
            this.packetBuffer.writeVarInt(blockLightSection.length)
            this.packetBuffer.writeBuffer(blockLightSection)
        }
    }

    static get EMPTY_CHUNK_DATA(): ChunkData {
        // Create height map

        const bitsPerBlock = Math.ceil(Math.log2(384 + 1))

        const blocksPerLong = Math.floor(64 / bitsPerBlock)
        const longsRequired = Math.ceil(256 / blocksPerLong)

        const heightMap = nbt.comp({
            MOTION_BLOCKING: nbt.longArray(new Array(longsRequired).fill(0n)),
        }) as NBT

        // Create block data

        const blockData = new ClientBoundPacketBuffer()

        const numSections = 384 / 16

        blockData.writeVarInt(numSections)
        for (let i = 0; i < numSections; i++) {
            blockData.writeShort(0) // Block count (# non-air blocks)

            // Block states (Paletted Container)
            blockData.writeUnsignedByte(0) // Bits Per Entry
            blockData.writeVarInt(0) // TODO replace with air id
            blockData.writeVarInt(0) // Data Array Length
            // No data array

            // Biomes (Paletted Container)
            blockData.writeUnsignedByte(0) // Bits Per Entry
            blockData.writeVarInt(0) // TODO replace with plains id
            blockData.writeVarInt(0) // Data Array Length
            // No data array
        }

        return {
            heightMaps: heightMap,
            blockData: blockData.serialize(true),
            blockEntities: [],
        }
    }

    static get FLAT_CHUNK_DATA(): ChunkData {
        // Create height map

        const bitsPerBlock = Math.ceil(Math.log2(384 + 1))

        const blocksPerLong = Math.floor(64 / bitsPerBlock)
        const longsRequired = Math.ceil(256 / blocksPerLong)

        const heightMap = nbt.comp({
            MOTION_BLOCKING: nbt.longArray(new Array(longsRequired).fill(0n)),
        }) as NBT

        // Create block data

        const blockData = new ClientBoundPacketBuffer()

        const numSections = 384 / 16

        for (let i = 0; i < numSections; i++) {
            if (i === 4) { // Y = 0-16 section
                blockData.writeShort(16) // Block count (# non-air blocks)

                // TODO write a chunk data serializer and deserializer

                // Block states (Paletted Container)
                blockData.writeUnsignedByte(4) // Bits Per Entry

                // Pallette
                {
                    blockData.writeVarInt(2) // Pallette length
                    blockData.writeVarInt(BlockState.AIR) // Index 0000
                    blockData.writeVarInt(BlockState.GRASS_BLOCK) // Index 0001
                }

                // Data Array
                blockData.writeVarInt(4096 / 16) // Data Array Length

                // Flat Grass Plane (Y = 0)
                for (let i = 0; i < 16; i++) {
                    blockData.writeLong(0x1111111111111111n)
                }

                // All Air (Y = 1-16)
                for (let i = 256; i < 4096; i += 16) {
                    blockData.writeLong(0x0000000000000000n)
                }
            } else {
                blockData.writeShort(0) // Block count (# non-air blocks)

                // Block states (Paletted Container)
                blockData.writeUnsignedByte(0) // Bits Per Entry

                // Pallette
                {
                    blockData.writeVarInt(BlockState.AIR) // Single valued pallette id
                }

                // Data Array
                blockData.writeVarInt(0) // Data Array Length
                // No data array
            }

            // Biomes (Paletted Container)
            blockData.writeUnsignedByte(0) // Bits Per Entry
            blockData.writeVarInt(0) // TODO replace with plains id
            blockData.writeVarInt(0) // Data Array Length
            // No data array
        }

        return {
            heightMaps: heightMap,
            blockData: blockData.serialize(true),
            blockEntities: [],
        }
    }

    static get EMPTY_LIGHT_DATA(): LightData {
        const numSections = 384 / 16 + 2

        const emptySkyLightMask = new BitSet()

        for (let i = 0; i < numSections; i++) {
            emptySkyLightMask.set(i)
        }

        const emptyBlockLightMask = new BitSet()

        for (let i = 0; i < numSections; i++) {
            emptyBlockLightMask.set(i)
        }

        return {
            trustEdges: false,
            skyLightMask: new BitSet(), // Empty
            blockLightMask: new BitSet(), // Empty
            emptySkyLightMask,
            emptyBlockLightMask,
            skyLightSections: [],
            blockLightSections: [],
        }
    }
}
