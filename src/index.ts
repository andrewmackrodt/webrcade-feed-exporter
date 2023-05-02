import { convert } from './convert.js'
import { commandErrorHandler } from './utils.js'
import { Command } from 'commander'

const program = new Command()

program
    .name('webrcade-feed-exporter')
    .description('create a webЯcade feed from LaunchBox metadata')
    .version('0.0.0')

program
    .argument('<launchbox>', 'launchbox installation path')
    .option('-p, --prefix <string>', 'url prefix to access game content')
    .action(async (launchBoxPath: string, options: unknown) => {
        try {
            const categories = await convert(launchBoxPath)
            console.log('categories', JSON.stringify(categories, null, 2))
            // const metadata = await launchBox.metadata()
            // metadata.LaunchBox.Game.filter(d => d.DatabaseID === '9337')[0]
            // metadata.LaunchBox.GameAlternateName.filter(d => d.DatabaseID === '9337')
            // metadata.LaunchBox.GameImage.filter(d => d.DatabaseID === '9337')
        } catch (e) {
            commandErrorHandler(program, e)
        }

    })

program.parse()
