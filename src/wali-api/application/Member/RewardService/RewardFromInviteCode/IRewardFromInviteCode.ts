import { 
    Member,
    Message,
    Email,
    MemberLog } from './../../../../domain'

export default interface IRewardFromInviteCode
{
    execute(member : Member, inviteCode : string) : Promise<{ messages: Message[], emails: Email[], logs: MemberLog[] }>
}