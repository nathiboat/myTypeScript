import { Staff } from './../../../../domain'


export default interface ISelectAllStaffQuery
{
    execute() : Promise<Staff[]>
}
