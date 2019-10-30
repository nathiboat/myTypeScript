import { Context } from '../../index'
import { Staff } from '../../../../../domain/Staff'
import StaffMap from './StaffMap'
import { IInsertStaffCommand } from './../../../../../domain'


export default class InsertStaffCommand implements IInsertStaffCommand
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
            
            let values = Object.values(StaffMap.deconstruct(staff))
            let columns = Object.keys(StaffMap.deconstruct(staff)).join(',')

            let result = await this.context.query(`INSERT INTO staff (${ columns }) VALUES (?)`, [values])

            if(result && staff.roles.length > 0)
            {
                values = staff.roles.map((role)=> { return [result.insertId, role.id] })
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
