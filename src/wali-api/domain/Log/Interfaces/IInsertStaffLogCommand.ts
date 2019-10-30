import { StaffLog } from './../'


export default interface IInsertStaffLogCommand
{
    execute(staffLog : StaffLog) : Promise<null>
}
