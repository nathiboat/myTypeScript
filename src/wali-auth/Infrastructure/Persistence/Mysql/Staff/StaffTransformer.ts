import { Staff } from './../../../../Domain/Staff'
import Role from './../../../../Domain/Role/Role'


type DatabaseRow = { [key: string]: any }



export default abstract class StaffTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        // return rows.map((row) => {
        //     return Staff.build({
        //         id: row.staffID,
        //         email: row.emailAddress,
        //         state: row.state,
        //         createdAt: row.created,
        //         updatedAt: row.updated,
        //         name: row.name,
        //         password: row.passwordToken,
        //         description: row.title
        //     })
        // })

        // 1. Save here the already built Staff models
        let built : number[] = []
        let staffs : Staff[] = []
        
        // 2. Create unique Staff models
        rows.forEach((row)=> {

            // 3. Check if the staff with this id was not already created
            if(built.includes(row.staffID))
            {
                return
            }
            
            // 4. Create the new staff
            let staff = Staff.build({
                id: row.staffID,
                email: row.emailAddress,
                state: row.state,
                createdAt: row.created,
                updatedAt: row.updated,
                name: row.name,
                password: row.passwordToken,
                description: row.title
            })

            // 5. Add the staff id in the built list
            built.push(staff.id!)

            // 6. Push the new staff in the unique staffs array
            staffs.push(staff)
        })


        // 7. Build the Roles and assign them to the correct Staff
        rows.forEach((row)=> {

            // 8. If Staff doesn;t have any role assigned to it, then just move past this
            if(!row.role_id)
            {
                return
            }

            // 9. Create the new Role
            let role = Role.build({
                roleName: row.role_name,
                productName: row.product_name,
                roleDescription: row.role_description,
                createdAt: row.role_created_at,
                updatedAt: row.role_updated_at,
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

    static toRaw(model: Staff) 
    {
        return {
            id: model.id,
            email: model.email,
            state: model.state,
            created: model.createdAt,
            updated: model.updatedAt,
            name: model.name,
            passwordToken: model.password,
            title: model.description
        }
    }
}
