import { Match, MatchFactory } from './../../../../../domain'

export default class MatchResult
{
    private rows : { [key : string] : any }[]

    constructor(rows : { [key : string] : any }[])
    {
        this.rows = rows
    }

    retrieve()
    {
        return this.rows.map((row)=> {

            let match = MatchFactory.build({
                id: row.id,
                memberId1: row.memberID1,
                memberId2: row.memberID2
            })
            return match
        })
    }
}