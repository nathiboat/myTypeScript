import { Role } from './../../../../domain'


export default interface ISelectRoleIncludeIdsQuery
{
    execute(ids : number[]) : Promise<Role[]>
}
