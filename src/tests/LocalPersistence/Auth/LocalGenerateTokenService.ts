import ICheckTokenService from "../../../wali-api/application/Interfaces/ICheckTokenService"
import Datastore from 'nedb'
import { getLocalDatabaseContent } from '../../Helpers'
import {ICheckPasswordHashService, IGenerateToken} from "../../../wali-api/application/Interfaces"

export default class LocalGenerateTokenService implements IGenerateToken
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    execute(token: string) : string {

        return 'fakeToken'
    }


}
