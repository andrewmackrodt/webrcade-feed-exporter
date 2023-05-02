import { benchmark } from './utils.js'
import { SaxesParser } from 'saxes'
import fs from 'node:fs'

type XmlJsonObject = Record<string, unknown>

export async function xml2json<T = XmlJsonObject>(filepath: string): Promise<T> {
    let resolve: (value: T) => void
    let reject: (reason: unknown) => void

    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
    })

    const document: XmlJsonObject = {}
    let parent = document
    const stack: [XmlJsonObject, boolean][] = [[parent, false]]
    let permitText = false
    let text: string | null = null

    const stream = new SaxesParser()
    stream.on('error', err => reject(err))
    stream.on('end', () => resolve(document as T))

    stream.on('opentag', tag => {
        if ( ! tag.isSelfClosing) {
            if (tag.name in parent) {
                if ( ! Array.isArray(parent[tag.name])) {
                    parent[tag.name] = [parent[tag.name]]
                }
                (parent[tag.name] as unknown[]).push(parent = {})
            } else {
                parent = parent[tag.name] = {}
            }
            permitText = true
        } else {
            parent = parent[tag.name] = {}
            permitText = false
        }
        stack.push([parent, tag.isSelfClosing])
    })

    stream.on('text', _text => {
        if (permitText) {
            text = _text
        }
    })

    stream.on('closetag', tag => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [, selfCloseable] = stack.pop()!
        parent = stack[stack.length - 1][0]
        if ( ! selfCloseable) {
            if (permitText && text !== null) {
                parent[tag.name] = text
                text = null
            }
        } else {
            parent[tag.name] = null
        }
        permitText = false
    })

    return benchmark(
        { action: 'xml2json', path: filepath },
        () => {
            fs.createReadStream(filepath)
                .on('error', err => reject(err))
                .on('end', () => stream.close())
                .on('data', chunk => stream.write(chunk))

            return promise
        },
    )
}
