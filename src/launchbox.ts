import { xml2json } from './xml.js'
import path from 'node:path'

//region interfaces
interface LaunchBoxData<T> {
    LaunchBox: T
}

type Platforms = LaunchBoxData<{
    Platform: Platform[]
}>

interface Platform {
    Name: string
    Notes: string
}

type Games = LaunchBoxData<{
    AdditionalApplication: AdditionalApplication[]
    Game: Game[]
}>

interface Game {
    ApplicationPath: string
    DatabaseID?: string
    ID: string
    Notes: string | null
    Platform: string
    Region: string | null
    SortTitle: string | null
    Title: string
    Version: string | null
}

interface AdditionalApplication {
    ApplicationPath: string
    Disc: string
    GameID: string
    Id: string
    Name: string
    Region: string | null
    Version: string | null
}

type Metadata = LaunchBoxData<{
    GameAlternateName: GameAlternateName[]
    GameImage: GameImage[]
}>

interface GameAlternateName {
    AlternateName: string
    DatabaseID: string
    Region?: string
}

interface GameImage {
    CRC32: string
    DatabaseID: string
    FileName: string
    Region?: string
    Type: string
}
//endregion

export class LaunchBoxDatabase {
    protected readonly dir: string

    public constructor(dir: string) {
        this.dir = dir
    }

    public async games(platform: Platform | string): Promise<Games> {
        const name = typeof platform === 'object' ? platform.Name : platform
        const filepath = path.resolve(this.platformsDir, `${name}.xml`)
        return xml2json<Games>(filepath)
    }

    public async metadata(): Promise<Metadata> {
        return xml2json<Metadata>(this.metadataFile)
    }

    public async platforms(): Promise<Platforms> {
        return xml2json<Platforms>(this.platformsFile)
    }

    protected get dataDir(): string {
        return path.resolve(this.dir, 'Data')
    }

    protected get platformsDir(): string {
        return path.resolve(this.dataDir, 'Platforms')
    }

    protected get platformsFile(): string {
        return path.resolve(this.dataDir, 'Platforms.xml')
    }

    protected get metadataDir(): string {
        return path.resolve(this.dir, 'Metadata')
    }

    protected get metadataFile(): string {
        return path.resolve(this.metadataDir, 'Metadata.xml')
    }
}
