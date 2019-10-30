import { Container } from 'typescript-dependency-injection'

import { Context, TextShortcutRepository } from '../Persistence/Mysql'
import { GetShortcuts, GetShortcutsResponse, PostShortcut, DeleteShortcut, RestoreShortcut, UpdateShortcut } from '../../Application'

let container = new Container()

if(!process.env.MYSQL_HOST) { throw Error('Env values not set for MYSQL_HOST') }
if(!process.env.MYSQL_DATABASE) { throw Error('Env values not set for MYSQL_DATABASE') }
if(!process.env.MYSQL_USER) { throw Error('Env values not set for MYSQL_USER') }
if(!process.env.MYSQL_PASSWORD) { throw Error('Env values not set for MYSQL_PASSWORD') }
if(!process.env.MYSQL_PORT) { throw Error('Env values not set for MYSQL_PORT') }

container.resolve('Context', () => {
    return new Context(
        process.env.MYSQL_HOST!,
        process.env.MYSQL_DATABASE!,
        process.env.MYSQL_USER!,
        process.env.MYSQL_PASSWORD!,
        parseInt(process.env.MYSQL_PORT!))
})

container.register(TextShortcutRepository)
.dependsOnClass('Context')

container.register(GetShortcuts)
.dependsOnClass('TextShortcutRepository')
.dependsOn(()=> new GetShortcutsResponse)

container.register(PostShortcut)
.dependsOnClass('TextShortcutRepository')

container.register(DeleteShortcut)
.dependsOnClass('TextShortcutRepository')

container.register(RestoreShortcut)
.dependsOnClass('TextShortcutRepository')

container.register(UpdateShortcut)
.dependsOnClass('TextShortcutRepository')

export default container