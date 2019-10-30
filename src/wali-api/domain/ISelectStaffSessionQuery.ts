import StaffSession from './StaffSession'


export default interface ISelectStaffSessionQuery
{
    execute(request : { [key : string] : string | number }) : Promise<StaffSession[]>
}