interface Platform {
    type: string
    disc: boolean
    extensions?: string[]
}

export const platforms: Record<string, Platform> = {
    'Nintendo 64': {
        type: 'n64',
        disc: false,
    },
    'Sega CD': {
        type: 'segacd',
        disc: true,
        extensions: ['.chd'],
    },
    'Sega Genesis': {
        type: 'genesis',
        disc: false,
    },
    'Sony Playstation': {
        type: 'psx',
        disc: true,
        extensions: ['.chd', '.pbp'],
    },
    'Super Nintendo Entertainment System': {
        type: 'snes',
        disc: false,
    },
}

export interface Category {
    title: string
    longTitle?: string
    background?: string
    thumbnail?: string
    description?: string
    items: Item[]
}

interface ItemDiscProps { discs: string[] }
interface ItemRomProps { rom: string }
export type ItemProps = { uid: string} & (ItemDiscProps | ItemRomProps)

export interface Item {
    title: string
    longTitle?: string
    description?: string
    type: string
    thumbnail?: string
    background?: string
    props: ItemProps
}
