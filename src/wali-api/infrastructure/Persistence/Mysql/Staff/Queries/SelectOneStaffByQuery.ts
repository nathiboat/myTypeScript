import { Context } from './../../'
import StaffResult from './StaffResult'
import { ISelectOneStaffByQuery } from './../../../../../domain'

/*
    Select one Staff from the database table wali_staffs
    based on id, password, email or token.
    All this params should be unique in the database tabe so
    you will only receive one model
*/

export default class SelectOneStaffByQuery implements ISelectOneStaffByQuery
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    private assertValidRequestKey(key : string)
    {
        if(!['email', 'password', 'id'].includes(key))
        {
            throw Error(`Invalid key ${ key } supplied in request`)
        }
    }

    private optionalSql(key : string)
    {
        let sql : string = ''
        if(key === 'id')
        {
            sql = 'WHERE staff.staffID = ?'
        }

        if(key === 'email')
        {
            sql = 'WHERE staff.emailAddress = ?'
        }

        if(key === 'password')
        {
            sql = 'WHERE staff.passwordToken = ?'
        }

        // if(key === 'token')
        // {
        //     sql = 'WHERE staff.token = ?'
        // }

        return sql
    }

    async execute(request : { [key : string] : string | number })
    {
        // 1. Validate param key
        let key = Object.keys(request)[0]
        this.assertValidRequestKey(key)

        this.context.connect()
        // 2. Mysql query here
        let rows =  await this.context.query(
            `SELECT staff.staffID,
                    staff.name,
                    passwordToken,
                    emailAddress,
                    staff.title,
                    picture,
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
             LEFT JOIN wali_roles on wali_staffs_roles.role_id = wali_roles.id
             ${ this.optionalSql(key) }`, [ request[ key ] ])

        this.context.complete()
        return new StaffResult(rows).retrieve()[0]
    }
}
