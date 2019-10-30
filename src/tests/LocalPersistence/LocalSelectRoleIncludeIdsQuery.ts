import { ISelectRoleIncludeIdsQuery, RoleFactory } from './../../wali-api/domain'



export default class LocalSelectRoleIncludeIdsQuery implements ISelectRoleIncludeIdsQuery
{
    
    async execute(ids : number[])
    {
        return ids.map((id)=> {
            return RoleFactory.build({
                id: id,
                roleName: 'Admin',
                productName: 'Dashboard',
                roleDescription: 'Admin'
            })
        })
    }
}
