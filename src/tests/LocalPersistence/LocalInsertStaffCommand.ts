import { IInsertStaffCommand, Staff } from './../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalInsertStaffCommand implements IInsertStaffCommand
{
    private _db : Datastore 

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(staff : Staff)
    {
        this._db.insert(staff)
        return null
    }
}