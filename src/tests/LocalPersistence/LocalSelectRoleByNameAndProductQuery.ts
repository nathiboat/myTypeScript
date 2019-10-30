import { Role, ISelectRoleByNameAndProductQuery} from '../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalSelectRoleByNameAndProductQuery implements ISelectRoleByNameAndProductQuery
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(name : string, product : string) : Promise<Role>
    {
        await this._db.find({name: name, product : product})
        return new Role(product, name, undefined, undefined, 'test description')
    }
}