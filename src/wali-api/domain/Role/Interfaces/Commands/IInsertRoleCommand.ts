import { Role } from './../../../../domain'


export default interface IInsertRoleCommand
{
    execute(role: Role) : Promise<null>
}
