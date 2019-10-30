import { Member } from './../../../../domain'


export default interface ISelectMemberByIdQuery
{
    execute(id : number) : Promise<Member[]>
}
