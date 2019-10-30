import { Context } from './../../index'
import { Staff, Role } from './../../../../../domain'
import { IAttachStaffRoleCommand } from './../../../../../domain'

// NOT WORKING

export default class AttachStaffRoleCommand implements IAttachStaffRoleCommand
{

    private context : Context

    constructor (context : Context)
    {
        this.context = context;
    }

    async execute(staff : Staff, roles : Role[])
    {
        let result = await this.context.query(
            `INSERT INTO wali_staffs_roles
             (staff_id, role_id)
             VALUES (?, ?)`, [ staff.id, roles.map(role => role.id) ])

        this.context.complete()
        return null
    }
}
