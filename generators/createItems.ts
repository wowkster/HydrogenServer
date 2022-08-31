import Registry from '../registry/Registry'

const ITEMS_SECTION = Registry.getItems()

let output = ''

for (const key in ITEMS_SECTION.entries) {
    const id = key.replace('minecraft:', '')

    output += `${id.toUpperCase()} = getId('${id}'),\n`
}

console.log(output)
