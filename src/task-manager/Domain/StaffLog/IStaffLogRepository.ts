import StaffLog from './StaffLog'


export default interface IStaffLogRepository
{
    findOne(id : number) : Promise<StaffLog>

    add(log : StaffLog) : Promise<void>
}