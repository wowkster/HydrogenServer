import fs from 'fs'

export const REGISTRY_FILE: RegistryFile = JSON.parse(fs.readFileSync('.generated/reports/registries.json', 'utf8'))

export interface RegistryFile {
    [key: MinecraftIdentifier]: RegistrySection
}

export type MinecraftIdentifier = `minecraft:${string}`

export interface RegistrySection {
    default: MinecraftIdentifier
    protocol_id: number
    entries: {
        [key: MinecraftIdentifier]: {
            protocol_id: number
        }
    }
}

export default class Registry {
    static getBlocks(): RegistrySection {
        return REGISTRY_FILE['minecraft:block']
    }

    static getItems(): RegistrySection {
        return REGISTRY_FILE['minecraft:block']
    }

    static getEntityTypes(): RegistrySection {
        return REGISTRY_FILE['minecraft:entity_type']
    }
}

export function createGetId(section: RegistrySection): (identifier: string) => number {
    return function getId(identifier: string): number {
        if (!identifier.startsWith('minecraft:')) identifier = `minecraft:${identifier}`
    
        return section.entries[identifier as MinecraftIdentifier].protocol_id
    }
}