import { Context } from '../../index'
import { Staff } from '../../../../../domain/Staff'
import StaffMap from './StaffMap'
import { IUpdateStaffCommand } from './../../../../../domain'


export default class UpdateStaffCommand implements IUpdateStaffCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(staff : Staff)
    {
        try {
            this.context.connect()
            
            let pairs = Object.keys(StaffMap.deconstruct(staff)).map((key)=> {
                return `${ key } = ?`
            }).join(',')
            let values = Object.values(StaffMap.deconstruct(staff))

            await this.context.query(
                `UPDATE staff
                 SET ${ pairs }
                 WHERE staffID = ?`, [ ...values, staff.id ])

            await this.context.query(
                `DELETE FROM wali_staffs_roles
                 WHERE staff_id = ?`, [ staff.id ])

            if(staff.roles.length > 0)
            {
                values = staff.roles.map((role)=> { return [staff.id, role.id] })
                await this.context.query(
                    `INSERT INTO wali_staffs_roles (staff_id, role_id) VALUES ?`, [ values ])
            }
            this.context.complete()
            return null
        } catch(error) {
            this.context.rollback()
            throw error
        }
    }
}
