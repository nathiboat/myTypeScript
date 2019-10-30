import { Staff } from './../../../../domain'


export default interface IInsertStaffCommand
{
    execute(staff : Staff) : Promise<null>
}
