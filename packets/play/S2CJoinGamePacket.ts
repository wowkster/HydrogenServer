import Identifier from '../../util/Identifier';
import { GameMode } from '../../util/PlayEnums';
import S2CPacket from '../S2CPacket';

import {readFileSync} from 'fs'

export default class S2CJoinGamePacket extends S2CPacket {
    constructor() {
        super(0x26)

        this.packetBuffer.writeInt(0) // Client EID
        this.packetBuffer.writeBoolean(false) // is Hardcore
        this.packetBuffer.writeUnsignedByte(GameMode.CREATIVE) // Gamemode
        this.packetBuffer.writeByte(GameMode.CREATIVE) // Previous Gamemode

        this.packetBuffer.writeVarInt(1) // World Count
        this.packetBuffer.writeIdentifier(new Identifier('overworld')) // Dimension Names

        this.packetBuffer.writeBuffer(readFileSync('./nbt/dimension_codec.nbt'))
        this.packetBuffer.writeBuffer(readFileSync('./nbt/dimension.nbt'))

        this.packetBuffer.writeIdentifier(new Identifier('overworld')) // Dimension Name
        
        this.packetBuffer.writeLong(8083508735087n) // Hashed seed
        this.packetBuffer.writeVarInt(69) // Max Players

        this.packetBuffer.writeVarInt(4) // View Distance	
        this.packetBuffer.writeVarInt(4) // Simulation Distance

        this.packetBuffer.writeBoolean(false) // Reduced Debug Info
        this.packetBuffer.writeBoolean(true) // Enable respawn screen
        this.packetBuffer.writeBoolean(false) // Is Debug
        this.packetBuffer.writeBoolean(false) // Is Flat
    }
}