import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { Flag, TaskType, IFlagRepository } from './../../../../Domain'
import FlagTransformer from './FlagTransformer';


export default class FlagRepository extends BaseRepository<Flag> implements IFlagRepository {
    constructor(context: Context) 
    {
        super(context)
    }

    async findOne(id: number) 
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM wali_flagged WHERE id = ? LIMIT 1', [id])

        this._context.complete()
        return FlagTransformer.toModel(result)[0]
    }

    async findByTask(taskType: TaskType, id: number) : Promise<Flag[]> 
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                wali_flagged.id as flag_id,
                wali_flagged.created_at as flag_created_at, 
                wali_flagged.*, 
                staff.*
            FROM 
                wali_flagged
            LEFT JOIN 
                staff
            ON 
                wali_flagged.staff_id = staff.staffID 
            WHERE ticket_type = ? AND ticket_id = ?`, [ taskType.value, id ])

        this._context.complete()
        return FlagTransformer.toModel(result)
    }

    async add(flag: Flag) : Promise<void>
    {
        let raw = FlagTransformer.toRaw(flag)
        
        this._context.connect()
        let result = await this._context.query(`
            INSERT INTO wali_flagged (${ Object.keys(raw) }) VALUES (?)`, [ Object.values(raw) ])

        this._context.complete()
    }
}