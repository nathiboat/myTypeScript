import { Member } from './../../../../domain'


export default interface ISelectMemberByIdfaAndNotBlockedQuery
{
    execute(idfa : string) : Promise<Member[]>
}
