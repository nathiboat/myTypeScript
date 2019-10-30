import { Staff, StaffFactory, RoleFactory } from './../../../../../domain'


export default class StaffResult
{
    private rows : { [key : string] : any }[]

    constructor(rows : { [key : string] : any }[])
    {
        this.rows = rows
    }

    retrieve()
    {
        // 1. Save here the already built Staff models
        let built : number[] = []
        let staffs : Staff[] = []

        // 2. Create unique Staff models
        this.rows.forEach((row)=> {

            // 3. Check if the staff with this id was not already created
            if(built.includes(row.staffID))
            {
                return
            }
            
            // 4. Create the new staff
            let staff = StaffFactory.build({
                id: row.staffID,
                name: row.name,
                email: row.emailAddress,
                state: row.state,
                password: row.passwordToken,
                description: row.title,
                created: row.created,
                updated: row.updated
            })

            // 5. Add the staff id in the built list
            built.push(staff.id!)

            // 6. Push the new staff in the unique staffs array
            staffs.push(staff)
        })


        // 7. Build the Roles and assign them to the correct Staff
        this.rows.forEach((row)=> {

            // 8. If Staff doesn;t have any role assigned to it, then just move past this
            if(!row.role_id)
            {
                return
            }

            // 9. Create the new Role
            let role = RoleFactory.build({
                roleName: row.role_name,
                productName: row.product_name,
                roleDescription: row.role_description,
                created: row.role_created_at,
                updated: row.role_updated_at,
                id: row.role_id
            })

            // 10. Assign the role to the Staff
            staffs.forEach((staff)=> {
                if(row.staffID === staff.id)
                {
                    staff.addRole(role)
                }
            })
        })

        return staffs
    }
}
