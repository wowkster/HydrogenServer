import Registry from '../registry/Registry'

const ENTITY_TYPES_SECTION = Registry.getEntityTypes()

let output = ''

for (const key in ENTITY_TYPES_SECTION.entries) {
    const id = key.replace('minecraft:', '')

    output += `${id.toUpperCase()} = getId('${id}'),\n`
}

console.log(output)
