import { Member, IUpdateMemberCommand } from './../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalUpdateMemberCommand implements IUpdateMemberCommand
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(member : Member) : Promise<null>
    {
        this._db.insert(member)
        return null
    }
}