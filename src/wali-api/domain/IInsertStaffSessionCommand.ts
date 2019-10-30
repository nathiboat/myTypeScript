import StaffSession from './StaffSession'


export default interface IInsertStaffSessionCommand
{
    execute(staffSession : StaffSession) : Promise<null>
}