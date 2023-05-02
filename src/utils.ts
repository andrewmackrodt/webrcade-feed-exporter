import { Command } from 'commander'
import process from 'process'

export async function benchmark<T>(params: Record<string, string>, cb: () => Promise<T>): Promise<T> {
    const startedAt = Date.now()
    let isError = false
    try {
        return await cb()
    } catch (e) {
        isError = true
        throw e
    } finally {
        const elapsed = Date.now() - startedAt
        const prefix = Object.entries(params).map(([k, v]) => `${k}="${v}"`).join(' ')
        console.debug(`${prefix} success=${String( ! isError)} elapsed=${elapsed}`)
    }
}

export function commandErrorHandler(program: Command, e: unknown) {
    if (typeof e === 'object' && e !== null
        && 'signal' in e
        && e.signal === 'SIGINT'
    ) {
        process.exit(1)
    }

    program.error(e?.toString() ?? 'Unknown error')
}
