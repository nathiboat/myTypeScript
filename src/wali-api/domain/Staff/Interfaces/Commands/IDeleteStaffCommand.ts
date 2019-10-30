import { Staff } from './../../'


export default interface IDeleteStaffCommand
{
    execute(staff : Staff) : Promise<null>
}
