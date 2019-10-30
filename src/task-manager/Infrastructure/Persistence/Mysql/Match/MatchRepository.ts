import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { Member, Match, IMatchRepository } from './../../../../Domain'


export default class MatchRepository extends BaseRepository<Match> implements IMatchRepository 
{
    constructor(context: Context) 
    {
        super(context)
    }

    async findOne(id: number) 
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM matches WHERE id = ? LIMIT 1', [id])

        this._context.complete()
        return new Match(result[0].id)
    }

    async findByMembers(members : Member[]) : Promise<Match | null> 
    {
        if(members.length !== 2)
        {
            throw Error('Invalid members number supplied to repository. Should be exactly 2')
        }
        this._context.connect()
        let result = await this._context.query(`
            SELECT * 
            FROM 
                matches 
            WHERE 
                (memberID1 = ? AND memberID2 = ?)
            OR 
                (memberID1 = ? AND memberID2 = ?)
            LIMIT 1`, [ members[0].memberId, members[1].memberId, members[1].memberId, members[0].memberId ])

        this._context.complete()

        // No match found
        if(result.length === 0)
        {
            return null
        }
        return new Match(result[0].id)
    }
}