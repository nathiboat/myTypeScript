import Member from './Member'


export default interface IMemberRepository
{
    findOne(id : number) : Promise<Member>

    all() : Promise<Member[]>

    allFlagged() : Promise<Member[]>
}