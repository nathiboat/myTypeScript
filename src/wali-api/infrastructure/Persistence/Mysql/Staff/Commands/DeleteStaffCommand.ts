import { Context } from '../../index'
import { Staff } from '../../../../../domain/Staff'
import { IDeleteStaffCommand } from './../../../../../domain'


export default class DeleteStaffCommand implements IDeleteStaffCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(staff : Staff)
    {
        try {
            if(!staff.id)
            {
                throw Error('Staff does not have an id')
            }

            this.context.connect()
            if(staff.roles.length > 0)
            {
                await this.context.query(
                    `DELETE FROM wali_staffs_roles WHERE staff_id = ?`, [ staff.id ])
            }

            await this.context.query(`DELETE FROM staff WHERE id = ?`, [ staff.id ])

            this.context.complete()
            return null
        } catch(error) {
            this.context.rollback()
            throw error
        }
    }
}
