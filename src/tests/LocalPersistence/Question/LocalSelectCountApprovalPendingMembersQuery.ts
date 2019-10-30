import Datastore from 'nedb'
import { ISelectCountApprovalPendingMembersQuery } from "../../../wali-api/domain/Member/Interfaces/Queries"
import { getLocalDatabaseContent } from '../../Helpers'

export default class LocalSelectCountApprovalPendingMembersQuery implements ISelectCountApprovalPendingMembersQuery{

    private _db : Datastore

    constructor(db: Datastore )
    {
        this._db = db
    }

    async execute() {

        let result =  await  getLocalDatabaseContent(this._db)
        return result.length
    }
}
