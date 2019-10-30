import Datastore from 'nedb'
import { ISelectAllRolesQuery } from "../../../wali-api/domain/Role/Interfaces/Queries"
import { Role, RoleFactory } from './../../../wali-api/domain'


export default class LocalSelectAllRolesQuery implements ISelectAllRolesQuery {

    private _db : Datastore

    constructor(db: Datastore )
    {
        this._db = db
    }

    async execute() {

        let roles: Role[] = []

        roles.push(RoleFactory.build({
            productName: 'dashboard',
            roleName: 'admin',
            roleDescription:  'admin role',
            id:  1
        }))

        roles.push(RoleFactory.build({
            productName: 'team',
            roleName: 'community',
            roleDescription:  'community role',
            id:  2
        }))

        return roles
    }
}
