import StaffSession from './StaffSession'


export default interface IUpdateStaffSessionCommand
{
    execute(staffSession : StaffSession) : Promise<null>
}