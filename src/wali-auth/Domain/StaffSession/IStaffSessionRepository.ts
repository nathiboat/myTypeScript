import StaffSession from './StaffSession'


export default interface IStaffSessionRepository
{
    findOneByToken(token : string) : Promise<StaffSession>

    add(log : StaffSession) : Promise<void>
}