import { MemberLog, IInsertMemberLogCommand } from './../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalInsertMemberLogCommand implements IInsertMemberLogCommand
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(memberLog : MemberLog)
    {
        this._db.insert(memberLog)
        return null
    }
}