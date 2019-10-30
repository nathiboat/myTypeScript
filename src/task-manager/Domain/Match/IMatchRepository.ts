import Match from './Match'
import Member from './../Member/Member'


export default interface IMatchRepository
{
    findOne(id : number) : Promise<Match>

    findByMembers(members : Member[]) : Promise<Match | null>
}