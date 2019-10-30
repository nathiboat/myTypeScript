import { Role } from '../../../../../domain'

export default class RoleMap
{
    static deconstruct(role : Role) : { [key : string] : any }
    {
        return {
            product_name: role.productName,
            role_name: role.roleName,
            role_description: role.roleDescription,
            created_at: role.created,
            updated_at: role.created
        }
    }
}
