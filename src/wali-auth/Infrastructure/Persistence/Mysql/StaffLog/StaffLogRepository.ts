import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { StaffLog, IStaffLogRepository } from './../../../../Domain/StaffLog'
import StaffLogTransformer from './StaffLogTransformer';


export default class StaffLogRepository extends BaseRepository<StaffLog> implements IStaffLogRepository
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOne(id : number)
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM staffLogs WHERE id = ? LIMIT 1', [ id ])

        this._context.complete()
        return StaffLogTransformer.toModel(result)[0]
    }

    async add(log : StaffLog) : Promise<void>
    {
        let raw = StaffLogTransformer.toRaw(log)

        this._context.connect()
        let result = await this._context.query(`
            INSERT INTO staffLogs 
                (${ Object.keys(raw) }) 
                VALUES (?)`, [ Object.values(raw) ])
        
        this._context.complete()
    }
}