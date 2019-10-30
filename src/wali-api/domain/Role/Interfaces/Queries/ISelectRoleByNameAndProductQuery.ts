import { Role } from './../../../../domain'


export default interface ISelectRoleByNameAndProductQuery
{
    execute(name : string, product : string) : Promise<Role>
}
