
import { Match } from './../../index'

export default interface ISelectMatchIdQuery
{
    execute(memberId1 : number, memberId2 : number) : Promise<Match>
}