import ICheckTokenService from './../Infrastructure/Jwt/ICheckTokenService'
import { Staff, IStaffRepository } from './../Domain/Staff'
import Role from './../Domain/Role/Role'
import IStaffSessionRepository from './../Domain/StaffSession/IStaffSessionRepository'


export default class WaliAuthenticate
{
    private _validRoles = ['agent', 'admin', 'community']

    constructor(
        private _staffRepo : IStaffRepository,
        private _staffSessionRepo : IStaffSessionRepository,
        private _checkToken : ICheckTokenService) 
    {
        //
    }

    async execute(token : string, productName : string, roleName? : string) : Promise<Staff | false>
    {
        try {

            if(roleName && !this._validRoles.includes(roleName))
            {
                throw Error('Role supplied to the middleware is not valid')
            }

            // 1. Check if the token is valid, should throw error if invalid
            this._checkToken.execute(token)
            
            let session = await this._staffSessionRepo.findOneByToken(token)
            
            if(!session)
            {
                return false
            }
            
            // 2. Get the Staff from database based on token
            let foundStaff = await this._staffRepo.findOneById(session.staffId)
    
            if(!foundStaff)
            {
                return false
            }

            let roles = foundStaff.roles
            
            if(!roleName)
            {
                if(this.hasProduct(roles, productName))
                {
                    return foundStaff
                }
                return false
            }

            if(this.hasRole(roles, productName, roleName))
            {
                return foundStaff
            }
            return false

        } catch(error) {
            console.log(error)
            throw error
        }
    }

    private hasRole(roles : Role[], productName : string, roleName :  string) 
    {
        let found = false
        roles.forEach((role : Role) => {
            if(role.roleName === roleName && role.productName === productName)
            {
                found = true
            }
        })
        return found
    }

    private hasProduct(roles : Role[], productName : string) 
    {
        let found = false
        roles.forEach((role : Role) => {
            if(role.productName === productName)
            {
                found = true
            }
        })
        return found
    }
}
