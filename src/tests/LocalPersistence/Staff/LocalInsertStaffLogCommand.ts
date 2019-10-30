import { StaffLog, IInsertStaffLogCommand, Match } from '../../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalInsertStaffLogCommand implements IInsertStaffLogCommand
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(staffLog : StaffLog) : Promise<null>
    {
        this._db.insert(staffLog)
        return null
    }
}
