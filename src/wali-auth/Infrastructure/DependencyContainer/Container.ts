import { Container } from 'typescript-dependency-injection'
import Context from './../Persistence/Mysql/Context'
import { StaffRepository, StaffSessionRepository } from '../Persistence/Mysql'
import WaliAuthenticate from './../../Application/WaliAuthenticate'
import CheckTokenService from './../Jwt/CheckTokenService'



let container = new Container()

if(!process.env.MYSQL_HOST) { throw Error('Env values not set for MYSQL_HOST') }
if(!process.env.MYSQL_DATABASE) { throw Error('Env values not set for MYSQL_DATABASE') }
if(!process.env.MYSQL_USER) { throw Error('Env values not set for MYSQL_USER') }
if(!process.env.MYSQL_PASSWORD) { throw Error('Env values not set for MYSQL_PASSWORD') }
if(!process.env.MYSQL_PORT) { throw Error('Env values not set for MYSQL_PORT') }


// Register dependencies into the container here

container.resolve('Context', ()=> {
    return new Context(
        process.env.MYSQL_HOST!,
        process.env.MYSQL_DATABASE!,
        process.env.MYSQL_USER!,
        process.env.MYSQL_PASSWORD!,
        parseInt(process.env.MYSQL_PORT!))
})

container.register(StaffRepository)
        .dependsOnClass('Context')

container.register(StaffSessionRepository)
        .dependsOnClass('Context')

if(!process.env.JWT_SECRET) { throw Error('Env values not set for JWT_SECRET') }

container.register(CheckTokenService)
        .dependsOnString(process.env.JWT_SECRET)

container.register(WaliAuthenticate)
        .dependsOnClass('StaffRepository')
        .dependsOnClass('StaffSessionRepository')
        .dependsOnClass('CheckTokenService')


export default container
