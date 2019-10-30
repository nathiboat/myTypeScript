import ICheckTokenService from "../../../wali-api/application/Interfaces/ICheckTokenService"
import Datastore from 'nedb'
import { getLocalDatabaseContent } from '../../Helpers'

export default class LocalCheckTokenService implements ICheckTokenService
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    execute(token: string)  {

        return 'sdfsdfsdfsdafs'
    }


}
