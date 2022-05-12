import DisplayedSkinParts from './DisplayedSkinParts'

export enum ClientChatMode {
    ENABLED = 0,
    COMMANDS_ONLY = 1,
    HIDDEN = 2,
}

export enum MainHand {
    LEFT = 0,
    RIGHT = 1,
}

export class ClientSettings {
    textFiltering: boolean = false

    constructor(
        public readonly locale: string,
        public readonly viewDistance: number,
        public readonly chatMode: ClientChatMode,
        public readonly chatColors: boolean,
        public readonly displayedSkinParts: DisplayedSkinParts,
        public readonly mainHand: MainHand,
        public readonly allowServerListings: boolean
    ) {}
}
