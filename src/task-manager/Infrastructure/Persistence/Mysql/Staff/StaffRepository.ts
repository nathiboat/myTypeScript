import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { Staff } from './../../../../Domain'
import StaffTransformer from './StaffTransformer';


export default class StaffRepository extends BaseRepository<Staff>
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOne(id : number)
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM staff WHERE staffID = ? LIMIT 1', [ id ])

        this._context.complete()
        return StaffTransformer.toModel(result)[0]
    }
}