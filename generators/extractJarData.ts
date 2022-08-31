import { existsSync } from 'fs'
import { writeFile, mkdir, rm } from 'fs/promises'

import axios from 'axios'
import { exec } from 'child_process'
import path from 'path'

const JAR_URL = 'https://launcher.mojang.com/v1/objects/c8f83c5655308435b3dcf03c06d9fe8740a77469/server.jar'

const JAR_FOLDER = '.generator'
const JAR_NAME = 'server.jar'
const JAR_PATH = path.resolve(JAR_FOLDER, JAR_NAME)

const OUTPUT_FOLDER = '.generated'

if (existsSync(JAR_FOLDER)) await rm(JAR_FOLDER, { recursive: true, force: true })
await mkdir(JAR_FOLDER, { recursive: true })

if (existsSync(OUTPUT_FOLDER)) await rm(OUTPUT_FOLDER, { recursive: true, force: true })
await mkdir(OUTPUT_FOLDER, { recursive: true })

const jarStream = await axios.get(JAR_URL, {
    responseType: 'arraybuffer',
})

await writeFile(JAR_PATH, jarStream.data)

await new Promise(res => {
    exec(
        `java -DbundlerMainClass=net.minecraft.data.Main -jar ${JAR_NAME} --server --reports --output ../${OUTPUT_FOLDER}`,
        {
            cwd: JAR_FOLDER,
        },
        res
    )
})

await rm(JAR_FOLDER, { recursive: true, force: true })
await rm(path.resolve(OUTPUT_FOLDER, '.cache'), { recursive: true, force: true })
