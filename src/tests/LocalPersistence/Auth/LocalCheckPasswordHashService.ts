import ICheckTokenService from "../../../wali-api/application/Interfaces/ICheckTokenService"
import Datastore from 'nedb'
import { getLocalDatabaseContent } from '../../Helpers'
import {ICheckPasswordHashService} from "../../../wali-api/application/Interfaces"

export default class LocalCheckPasswordHashService implements ICheckPasswordHashService
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    execute(token: string) : boolean {

        return true
    }


}
