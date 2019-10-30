import { Staff } from './../../../../domain'


export default interface ISelectOneStaffByQuery
{
    execute(request : { [key : string] : string | number }) : Promise<Staff>
}
