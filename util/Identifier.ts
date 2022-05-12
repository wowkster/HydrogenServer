export default class Identifier {
    readonly namespace: string
    readonly value: string

    constructor(value: string, namespace = 'minecraft') {
        this.value = value
        this.namespace = namespace
    }

    static from(identifier: string): Identifier {
        if (!/0123456789abcdefghijklmnopqrstuvwxyz-_/.test(identifier)) throw new Error('Invalid chars in Identifier!')

        const parts = identifier.split(':')

        if (parts.length > 2) {
            throw new Error('Invalid Identifier!')
        }

        if (parts.length === 1) {
            return new Identifier(parts[0])
        }

        return new Identifier(parts[1], parts[0])
    }

    toString() {
        return `${this.namespace}:${this.value}`
    }
}
