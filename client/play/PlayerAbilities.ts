export enum PlayerAbilityFlags {
    INVULNERABLE = 0x01,
    FLYING = 0x02,
    ALLOW_FLYING = 0x04,
    CREATIVE_MODE = 0x08,
}

export default class PlayerAbilities {
    invulnerable: boolean
    flying: boolean
    allowFlying: boolean
    creativeMode: boolean

    constructor(flags?: PlayerAbilityFlags[]) {
        this.invulnerable = flags?.includes(PlayerAbilityFlags.INVULNERABLE) ?? false
        this.flying = flags?.includes(PlayerAbilityFlags.FLYING) ?? false
        this.allowFlying = flags?.includes(PlayerAbilityFlags.ALLOW_FLYING) ?? false
        this.creativeMode = flags?.includes(PlayerAbilityFlags.CREATIVE_MODE) ?? false
    }

    serialize() {
        let value = 0x00

        value |= this.invulnerable ? PlayerAbilityFlags.INVULNERABLE : 0x00
        value |= this.flying ? PlayerAbilityFlags.FLYING : 0x00
        value |= this.allowFlying ? PlayerAbilityFlags.ALLOW_FLYING : 0x00
        value |= this.creativeMode ? PlayerAbilityFlags.CREATIVE_MODE : 0x00

        return value
    }
}
