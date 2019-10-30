import Staff from './Staff'



export default interface IStaffRepository
{
    findOneById(id : number) : Promise<Staff>
}