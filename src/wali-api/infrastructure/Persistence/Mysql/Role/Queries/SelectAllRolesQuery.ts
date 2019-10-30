import { Context } from './../../'
import RoleResult from './RoleResult'
import { ISelectAllRolesQuery } from './../../../../../domain'



export default class SelectAllRolesQuery implements ISelectAllRolesQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute()
    {
        this.context.connect()
        let rows =  await this.context.query(
            `SELECT *
             FROM wali_roles`)
        this.context.complete()
        return new RoleResult(rows).retrieve()
    }
}
