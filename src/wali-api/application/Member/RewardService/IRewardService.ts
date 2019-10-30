import { 
    Member, 
    Answer, 
    Message, 
    Email, 
    MemberLog } from './../../../domain'



export default interface IRewardService
{
    execute(member : Member, answer : Answer) : Promise<{ messages: Message[], emails: Email[], logs: MemberLog[] }>

    approved(member : Member, answer : Answer) : Promise<{ messages: Message[], emails: Email[], logs: MemberLog[] }>
    
    rejected(member : Member, answer : Answer) : Promise<{ messages: Message[], emails: Email[], logs: MemberLog[] }>
}