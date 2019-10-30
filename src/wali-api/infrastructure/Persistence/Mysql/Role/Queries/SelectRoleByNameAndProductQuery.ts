import { Context } from './../../'
import RoleResult from './RoleResult'
import { ISelectRoleByNameAndProductQuery } from './../../../../../domain'


export default class SelectRoleByNameAndProductQuery implements ISelectRoleByNameAndProductQuery
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(name : string, product : string)
    {
        this.context.connect()
        let rows = await this.context.query(
            `SELECT *
             FROM wali_roles
             WHERE role_name = ?
             AND product_name = ?
             LIMIT 1`, [ name, product ])
        this.context.complete()
        return new RoleResult(rows).retrieve()[0]
    }
}
