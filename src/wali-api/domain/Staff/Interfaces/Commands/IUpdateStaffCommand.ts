import { Staff } from './../../../../domain'


export default interface IUpdateStaffCommand
{
    execute(staff : Staff) : Promise<null>
}
