import { ClientChatMode, ClientSettings } from './../../client/play/ClientSettings'
import C2SPacket from '../C2SPacket'
import ServerBoundPacketBuffer from '../../util/ServerBoundPacketBuffer'
import DisplayedSkinParts from '../../client/play/DisplayedSkinParts'
import { MainHand } from '../../client/play/ClientSettings'

/**
 * https://wiki.vg/Protocol#Client_Settings
 */
export default class C2SClientSettingsPacket extends C2SPacket {
    clientSettings: ClientSettings

    constructor(packetBuffer: ServerBoundPacketBuffer) {
        super(packetBuffer)

        const locale = packetBuffer.readString()
        const viewDistance = packetBuffer.readByte()
        const chatMode: ClientChatMode = packetBuffer.readVarInt()
        const chatColors = packetBuffer.readBoolean()
        const displayedSkinParts = new DisplayedSkinParts(packetBuffer.readUnsignedByte())
        const mainHand: MainHand = packetBuffer.readVarInt()
        const textFiltering = packetBuffer.readBoolean() // Not used
        const allowServerListings = packetBuffer.readBoolean()

        this.clientSettings = new ClientSettings(
            locale,
            viewDistance,
            chatMode,
            chatColors,
            displayedSkinParts,
            mainHand,
            allowServerListings
        )
    }
}
