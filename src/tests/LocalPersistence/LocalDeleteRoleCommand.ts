import { IDeleteRoleCommand } from '../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalDeleteRoleCommand implements IDeleteRoleCommand
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(roleId : number)
    {
        this._db.remove(roleId)
        return null
    }
}