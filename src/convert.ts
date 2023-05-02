import { LaunchBoxDatabase } from './launchbox.js'
import { Category, Item, ItemProps, platforms as webrcadePlatforms } from './webrcade.js'
import path from 'node:path'

export async function convert(launchBoxPath: string): Promise<Category[]> {
    const launchBox = new LaunchBoxDatabase(launchBoxPath)
    const launchBoxPlatformsData = await launchBox.platforms()
    const categories: Category[] = []

    for (const launchBoxPlatform of launchBoxPlatformsData.LaunchBox.Platform) {
        const webrcadePlatform = webrcadePlatforms[launchBoxPlatform.Name]

        if ( ! webrcadePlatform) {
            continue
        }

        const category: Category = {
            title: launchBoxPlatform.Name,
            longTitle: launchBoxPlatform.Name,
            background: `http://webrcade.localhost:8080/content/images/${webrcadePlatform.type}-background.png`,
            thumbnail: `http://webrcade.localhost:8080/content/images/${webrcadePlatform.type}-thumb.png`,
            description: launchBoxPlatform.Notes,
            items: [],
        }

        const launchBoxGamesData = await launchBox.games(launchBoxPlatform)

        const launchBoxGames = launchBoxGamesData.LaunchBox.Game.sort((a, b) => {
            const aSortTitle = typeof a.SortTitle === 'string' && a.SortTitle !== '' ? a.SortTitle : a.Title
            const bSortTitle = typeof b.SortTitle === 'string' && b.SortTitle !== '' ? b.SortTitle : b.Title

            return aSortTitle.localeCompare(bSortTitle)
        })

        for (const launchBoxGame of launchBoxGames) {
            const filename = path.basename(launchBoxGame.ApplicationPath.replaceAll(/\\/g, '/'))

            if (Array.isArray(webrcadePlatform.extensions) && webrcadePlatform.extensions.length > 0) {
                const extension = filename.replace(/.+(\.[A-Za-z][A-Za-z0-9]+)$/, '$1').toLowerCase()
                if ( ! webrcadePlatform.extensions.includes(extension)) {
                    continue
                }
            }

            const uri = `http://webrcade.localhost:8080/content/roms/${webrcadePlatform.type}/` + encodeURI(filename)
            let props: ItemProps

            if (webrcadePlatform.disc) {
                props = {
                    uid: launchBoxGame.ID,
                    discs: [
                        uri,
                    ],
                }
            } else {
                props = {
                    uid: launchBoxGame.ID,
                    rom: uri,
                }
            }

            const item: Item = {
                title: launchBoxGame.Title,
                longTitle: [launchBoxGame.Title, launchBoxGame.Version].filter(s => Boolean(s)).join(' ').trim(),
                ...( launchBoxGame.Notes ? { description: launchBoxGame.Notes } : {} ),
                type: webrcadePlatform.type,
                thumbnail: `http://webrcade.localhost:8080/content/images/${webrcadePlatform.type}/${launchBoxGame.DatabaseID}-thumb.png`,
                background: `http://webrcade.localhost:8080/content/images/${webrcadePlatform.type}/${launchBoxGame.DatabaseID}-background.png`,
                props,
            }

            category.items.push(item)
        }

        categories.push(category)
    }

    return categories
}
