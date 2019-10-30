import { Role } from './../../../../domain'


export default interface ISelectRoleByIdQuery
{
    execute(id : number) : Promise<Role>
}
