import { Member } from './../../../../domain'


export default interface ISelectMemberByHashIdQuery
{
    execute(memberHashId : string) : Promise<Member>
}
