import { Context } from "./../../index"
import { Role } from './../../../../../domain'
import RoleMap from './RoleMap'
import { IInsertRoleCommand } from './../../../../../domain'



export default class InsertRoleCommand implements IInsertRoleCommand
{

    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(role: Role)
    {
        this.context.connect()
        let values = Object.values(RoleMap.deconstruct(role))
        let columns = Object.keys(RoleMap.deconstruct(role)).join(',')

        await this.context.query(`INSERT INTO wali_roles (${ columns }) VALUES (?)`, [values])
        this.context.complete()
        return null
    }
}
