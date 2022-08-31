import DisplayedSkinParts from './DisplayedSkinParts'
import { DisplayedSkinPartsFlags } from './DisplayedSkinParts'

describe('Displayed Skin Parts bit manipulation', () => {
    it('Constructs a DisplayedSkinParts from flag array', () => {
        const skinParts = new DisplayedSkinParts([DisplayedSkinPartsFlags.JACKET, DisplayedSkinPartsFlags.LEFT_PANTS])

        expect(skinParts.cape).toBe(false)
        expect(skinParts.jacket).toBe(true)
        expect(skinParts.leftSleeve).toBe(false)
        expect(skinParts.rightSleeve).toBe(false)
        expect(skinParts.leftPants).toBe(true)
        expect(skinParts.rightPants).toBe(false)
        expect(skinParts.hat).toBe(false)
    })

    it('Constructs a DisplayedSkinParts from byte', () => {
        let byte = 0

        byte |= DisplayedSkinPartsFlags.LEFT_SLEEVE
        byte |= DisplayedSkinPartsFlags.HAT

        const skinParts = new DisplayedSkinParts(byte)

        expect(skinParts.cape).toBe(false)
        expect(skinParts.jacket).toBe(false)
        expect(skinParts.leftSleeve).toBe(true)
        expect(skinParts.rightSleeve).toBe(false)
        expect(skinParts.leftPants).toBe(false)
        expect(skinParts.rightPants).toBe(false)
        expect(skinParts.hat).toBe(true)
    })
})
