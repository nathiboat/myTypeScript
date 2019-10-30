import { Context } from './../../'
import RoleResult from './RoleResult'
import { ISelectRoleIncludeIdsQuery } from './../../../../../domain'



export default class SelectRoleIncludeIdsQuery implements ISelectRoleIncludeIdsQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute(ids : number[])
    {
        this.context.connect()
        let rows =  await this.context.query(
            `SELECT *
             FROM wali_roles
             WHERE id IN (?)`, [ ids ])
        this.context.complete()
        return new RoleResult(rows).retrieve()
    }
}
