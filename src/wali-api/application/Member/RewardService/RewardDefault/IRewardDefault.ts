import { 
    Member,
    Message,
    MemberLog, 
    Email } from './../../../../domain'




export default interface IRewardDefault
{
    execute(member : Member) : Promise<{ messages: Message[], emails: Email[], logs : MemberLog[] }>
}