export default class Identifier {
    readonly namespace: string
    readonly value: string

    /**
     * Three possibilities:
     * new Identifier('minecraft:brand')
     * new Identifier('brand')
     * new Identifier('minecraft', 'brand')
     */
    constructor(namespace: string, value?: string) {
        if (typeof value !== 'undefined') {
            this.namespace = namespace
            this.value = value
            return
        }

        const split = namespace.split(':')

        if (split.length > 2) throw new Error('Malformed Identifier')
        else if (split.length == 1) {
            this.namespace = 'minecraft'
            this.value = split[0]
        } else {
            this.namespace = split[0]
            this.value = split[1]
        }
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

    equals(other: string | Identifier) {
        const otherID = typeof other === 'string' ? new Identifier(other) : other

        return otherID.namespace === this.namespace &&  otherID.value === this.value 
    }
}
