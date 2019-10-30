import { Approval, IUpdateMemberApprovalCommand } from '../../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalUpdateMemberApprovalCommand implements IUpdateMemberApprovalCommand
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(approval : Approval) : Promise<null>
    {

        this._db.insert(approval)
        return null
    }
}
