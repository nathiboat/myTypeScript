import Role from './Role'

type RoleOptions = {
    productName : string,
    roleName : string,
    roleDescription? : string,
    created? : string,
    updated? : string,
    id? : number
}

export default abstract class RoleFactory
{
    static build(options : RoleOptions)
    {
        return new Role(
            options.productName,
            options.roleName,
            options.created,
            options.updated,
            options.roleDescription,
            options.id)
    }
}
