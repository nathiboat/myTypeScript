import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { StaffSession, IStaffSessionRepository } from './../../../../Domain/StaffSession'
import StaffSessionTransformer from './StaffSessionTransformer';


export default class StaffSessionRepository extends BaseRepository<StaffSession> implements IStaffSessionRepository
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOneByToken(token : string)
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM staffSessions WHERE passwordToken = ? LIMIT 1', [ token ])

        this._context.complete()
        return StaffSessionTransformer.toModel(result)[0]
    }

    async add(log : StaffSession) : Promise<void>
    {
        let raw = StaffSessionTransformer.toRaw(log)

        this._context.connect()
        await this._context.query(`
            INSERT INTO staffSessions 
                (${ Object.keys(raw) }) 
                VALUES (?)`, [ Object.values(raw) ])
        
        this._context.complete()
    }
}