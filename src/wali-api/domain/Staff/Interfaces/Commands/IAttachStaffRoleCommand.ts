import { Staff, Role } from './../../../../domain'


export default interface IAttachStaffRoleCommand
{
    execute(staff : Staff, roles : Role[]) : Promise<null>
}
