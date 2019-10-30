import { Role, RoleFactory } from './../../../../../domain'


export default class RoleResult
{
    private rows : { [key : string] : any }[]

    constructor(rows : { [key : string] : any }[])
    {
        this.rows = rows
    }

    retrieve()
    {
        return this.rows.map((row)=> {
            return RoleFactory.build({
                roleName: row.role_name,
                productName: row.product_name,
                roleDescription: row.role_description,
                created: row.created_at,
                updated: row.updated_at,
                id: row.id
            })
        })
    }
}
