import Registry from '../registry/Registry'

const BLOCKS_SECTION = Registry.getBlocks()

let output = ''

for (const key in BLOCKS_SECTION.entries) {
    const id = key.replace('minecraft:', '')

    output += `${id.toUpperCase()} = getId('${id}'),\n`
}

console.log(output)
