import { Context } from './../../index'
import { IDetachStaffRoleCommand } from './../../../../../domain'



export default class DetachStaffRoleCommand implements IDetachStaffRoleCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(staffId? : number, roleId? : number)
    {
        if(!staffId && !roleId)
        {
            throw Error('Must specify a role id or a permission id')
        }

        if(staffId && roleId)
        {
            await this.detachStaffAndRole(staffId, roleId)
            return this.completeAndReturn()
        }

        if(staffId)
        {
            await this.detachStaff(staffId)
            return this.completeAndReturn()
        }

        if(roleId)
        {
            await this.detachRole(roleId)
            return this.completeAndReturn()
        }

        return this.completeAndReturn()
    }

    private completeAndReturn()
    {
        this.context.complete()
        return null
    }

    private async detachStaff(staffId : number)
    {
        return await this.context.query(
            `DELETE FROM wali_staffs_roles
             WHERE staff_id = ?`, [ staffId ])
    }

    private async detachRole(roleId : number)
    {
        return await this.context.query(
            `DELETE FROM wali_staffs_roles
             WHERE role_id = ?`, [ roleId ])
    }

    private async detachStaffAndRole(staffId : number, roleId : number)
    {
        return await this.context.query(
            `DELETE FROM wali_staffs_roles
             WHERE staff_id = ? AND role_id = ?`, [ staffId, roleId ])
    }
}
