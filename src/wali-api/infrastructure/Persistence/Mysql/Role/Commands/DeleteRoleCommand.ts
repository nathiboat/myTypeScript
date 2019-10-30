import { Context } from './../../index'
import { IDeleteRoleCommand } from './../../../../../domain'


export default class DeleteRoleCommand implements IDeleteRoleCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(id: number)
    {
        try {
            this.context.connect()
            await this.context.query(`DELETE FROM wali_staffs_roles WHERE role_id = ?`, [ id ])

            await this.context.query(`DELETE FROM wali_roles WHERE id = ?`, [ id ])

            this.context.complete()
            return null

        } catch(error) {
            this.context.rollback()
            throw error
        }
    }
}
