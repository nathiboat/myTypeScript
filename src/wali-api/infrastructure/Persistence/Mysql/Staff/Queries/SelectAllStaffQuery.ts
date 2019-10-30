import { Context } from './../../'
import StaffResult from './StaffResult'
import { ISelectAllStaffQuery } from './../../../../../domain'


/*
    Select all Staffs from the database table staff
*/

export default class SelectAllStaffQuery implements ISelectAllStaffQuery
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
            `SELECT staff.staffID,
                    staff.name,
                    passwordToken,
                    emailAddress,
                    staff.title,
                    state,
                    staff.created,
                    staff.updated,
                    wali_roles.id AS role_id,
                    wali_roles.product_name,
                    wali_roles.role_name,
                    wali_roles.role_description,
                    wali_roles.created_at as role_created_at,
                    wali_roles.updated_at AS role_updated_at
             FROM staff
             LEFT JOIN wali_staffs_roles on wali_staffs_roles.staff_id = staff.staffID
             LEFT JOIN wali_roles on wali_staffs_roles.role_id = wali_roles.id`)

        this.context.complete()
        return new StaffResult(rows).retrieve()
    }
}
