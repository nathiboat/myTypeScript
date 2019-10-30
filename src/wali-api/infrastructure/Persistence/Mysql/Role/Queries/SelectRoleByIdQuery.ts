import { Context } from './../../'
import RoleResult from './RoleResult'
import { ISelectRoleByIdQuery } from './../../../../../domain'



export default class SelectRoleByIdQuery implements ISelectRoleByIdQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute(id : number)
    {
        this.context.connect()
        let rows =  await this.context.query(
            `SELECT *
             FROM wali_roles
             WHERE id = ?`, [ id ])
        this.context.complete()
        return new RoleResult(rows).retrieve()[0]
    }
}
