import { Role, IInsertRoleCommand} from './../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalInsertRoleCommand implements IInsertRoleCommand
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(role : Role)
    {
        this._db.insert(role)
        return null
    }
}