import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { Staff } from './../../../../Domain/Staff'
import StaffTransformer from './StaffTransformer';


export default class StaffRepository extends BaseRepository<Staff>
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOneById(id : number)
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                staff.staffID,
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
            LEFT JOIN 
                wali_staffs_roles on wali_staffs_roles.staff_id = staff.staffID
            LEFT JOIN 
                wali_roles on wali_staffs_roles.role_id = wali_roles.id
            WHERE 
                staffID = ?`, [ id ])

        this._context.complete()
        return StaffTransformer.toModel(result)[0]
    }
}