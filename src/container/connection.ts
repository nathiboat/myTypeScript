import { Container } from 'typescript-dependency-injection'
import { Context } from './../wali-api/infrastructure/Persistence/Mysql'

let container = new Container()


if(!process.env.MYSQL_HOST) { throw Error('Env values not set for MYSQL_HOST') }
if(!process.env.MYSQL_DATABASE) { throw Error('Env values not set for MYSQL_DATABASE') }
if(!process.env.MYSQL_USER) { throw Error('Env values not set for MYSQL_USER') }
if(!process.env.MYSQL_PASSWORD) { throw Error('Env values not set for MYSQL_PASSWORD') }
if(!process.env.MYSQL_PORT) { throw Error('Env values not set for MYSQL_PORT') }

if(!process.env.SGTOKEN) { throw Error('Env values not set for SGTOKEN')}


// Register dependencies into the container here

container.resolve('Context', ()=> {
    return new Context(
        process.env.MYSQL_HOST!,
        process.env.MYSQL_DATABASE!,
        process.env.MYSQL_USER!,
        process.env.MYSQL_PASSWORD!,
        parseInt(process.env.MYSQL_PORT!))
})


export default container
