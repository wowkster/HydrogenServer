export enum DisplayedSkinPartsFlags {
    CAPE = 0x01,
    JACKET = 0x02,
    LEFT_SLEEVE = 0x04,
    RIGHT_SLEEVE = 0x08,
    LEFT_PANTS = 0x10,
    RIGHT_PANTS = 0x20,
    HAT = 0x40,
}

export default class DisplayedSkinParts {
    cape: boolean
    jacket: boolean
    leftSleeve: boolean
    rightSleeve: boolean
    leftPants: boolean
    rightPants: boolean
    hat: boolean

    constructor(flags?: DisplayedSkinPartsFlags[] | number) {
        if (typeof flags === 'number') {
            this.cape = !!((flags >> 0) & 1)
            this.jacket = !!((flags >> 1) & 1)
            this.leftSleeve = !!((flags >> 2) & 1)
            this.rightSleeve = !!((flags >> 3) & 1)
            this.leftPants = !!((flags >> 4) & 1)
            this.rightPants = !!((flags >> 5) & 1)
            this.hat = !!((flags >> 6) & 1)
            return
        }
        
        this.cape = flags?.includes(DisplayedSkinPartsFlags.CAPE) ?? false
        this.jacket = flags?.includes(DisplayedSkinPartsFlags.JACKET) ?? false
        this.leftSleeve = flags?.includes(DisplayedSkinPartsFlags.LEFT_SLEEVE) ?? false
        this.rightSleeve = flags?.includes(DisplayedSkinPartsFlags.RIGHT_SLEEVE) ?? false
        this.leftPants = flags?.includes(DisplayedSkinPartsFlags.LEFT_PANTS) ?? false
        this.rightPants = flags?.includes(DisplayedSkinPartsFlags.RIGHT_PANTS) ?? false
        this.hat = flags?.includes(DisplayedSkinPartsFlags.HAT) ?? false
    }

    serialize() {
        let value = 0x00

        value |= this.cape ? DisplayedSkinPartsFlags.CAPE : 0x00
        value |= this.jacket ? DisplayedSkinPartsFlags.JACKET : 0x00
        value |= this.leftSleeve ? DisplayedSkinPartsFlags.LEFT_SLEEVE : 0x00
        value |= this.rightSleeve ? DisplayedSkinPartsFlags.RIGHT_SLEEVE : 0x00
        value |= this.leftPants ? DisplayedSkinPartsFlags.LEFT_PANTS : 0x00
        value |= this.rightPants ? DisplayedSkinPartsFlags.RIGHT_PANTS : 0x00
        value |= this.hat ? DisplayedSkinPartsFlags.HAT : 0x00

        return value
    }
}
