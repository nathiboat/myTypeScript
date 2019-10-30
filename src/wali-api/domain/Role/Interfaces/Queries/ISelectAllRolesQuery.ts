import { Role } from './../../../../domain'


export default interface ISelectAllRolesQuery
{
    execute() : Promise<Role[]>
}
