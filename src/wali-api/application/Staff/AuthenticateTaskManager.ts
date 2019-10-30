import { ICheckTokenService } from './../'
import { ISelectOneStaffByQuery, Role, Staff, ISelectStaffSessionQuery } from './../../domain'


export default class AuthenticateTaskManager
{
    private _validRoles = ['agent', 'admin']

    constructor(
        private _selectStaff : ISelectOneStaffByQuery,
        private _checkToken : ICheckTokenService,
        private _selectStaffSession : ISelectStaffSessionQuery) 
    {
        //
    }

    async execute(token : string, roleName? : string) : Promise<Staff | false>
    {
        try {

            if(roleName && !this._validRoles.includes(roleName))
            {
                throw Error('Role supplied to the middleware is not valid')
            }

            // 1. Check if the token is valid, should throw error if invalid
            this._checkToken.execute(token)
            
            let sessions = await this._selectStaffSession.execute({ passwordToken : token })
            
            if(sessions.length === 0)
            {
                throw Error('No sessions found')
            }

            let session = sessions[0]

            // 2. Get the Staff from database based on token
            let foundStaff = await this._selectStaff.execute({ id : session.staffId })
            if(!foundStaff)
            {
                return false
            }

            let roles = foundStaff.roles

            // If NO roleName is supplied then check if staff has any of the valid roles
            if(!roleName)
            {
                let valid = false
                this._validRoles.forEach((roleName)=> {
                    if(this.hasRole(roles, roleName))
                    {
                        valid = true
                    }
                })

                if(!valid)
                {
                    return false
                }
                return foundStaff
            }

            // If roleName is supplied, then vcheck against it to see if the staff has that role
            if(this.hasRole(roles, roleName))
            {
                return foundStaff
            }
            return false

        } catch(error) {
            console.log(error)
            throw error
        }
    }

    private hasRole(roles : Role[], roleName :  string) 
    {
        let found = false
        roles.forEach((role : Role) => {
            if(role.roleName === roleName)
            {
                found = true
            }
        })
        return found
    }
}
