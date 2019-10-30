import { 
    Member,
    Message,
    Email,
    MemberLog } from './../../../../domain'


export default interface IRewardWithReferrerMember
{
    execute(member : Member) : Promise<{ messages: Message[], emails: Email[], logs: MemberLog[] }>
}
