import { RoleFactory, Role, ISelectRoleByIdQuery} from '../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalSelectRoleByIdQuery implements ISelectRoleByIdQuery
{
    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute(id : number) : Promise<Role>
    {
        await this._db.find(id)
        return RoleFactory.build({
            productName: 'test product',
            roleName : 'test role',
            id: id
        })
    }
}