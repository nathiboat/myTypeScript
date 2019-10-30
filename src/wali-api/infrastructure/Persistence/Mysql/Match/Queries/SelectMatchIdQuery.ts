import { Context } from '../..'
import MatchResult from './MatchResult'
import { ISelectMatchIdQuery } from './../../../../../domain'


export default class SelectMatchIdQuery implements ISelectMatchIdQuery 
{

    private _context : Context

    constructor (context : Context) {
        this._context = context
    }

    async execute(memberId1 : number, memberId2 : number) 
    {
        this._context.connect()

        let rows = await this._context.query(
            `SELECT *
             FROM matches
             WHERE memberID1 = ? AND memberID2 = ?`, [ memberId1, memberId2 ]
        )

        this._context.complete()
        return new MatchResult(rows).retrieve()[0]
    }
}