import { ICheckTokenService } from './../'
import { ISelectOneStaffByQuery, Role, Staff, ISelectStaffSessionQuery } from './../../domain'



export default class AuthenticateStaffService
{
    private _selectStaff : ISelectOneStaffByQuery

    private _checkToken : ICheckTokenService

    private _selectStaffSession : ISelectStaffSessionQuery

    private _authStaff? : Staff

    constructor(
        selectStaff : ISelectOneStaffByQuery,
        checkToken : ICheckTokenService,
        selectStaffSession : ISelectStaffSessionQuery
    ) {
        this._selectStaff        = selectStaff
        this._checkToken         = checkToken
        this._selectStaffSession = selectStaffSession
    }

    async execute(token : string, path : string)
    {
        let approveRoutes = [
            '/member/approve',
            '/member/block',
            '/member/flag',
            '/member/unblock',
            '/member/approve/pending'
        ]

        let teamRoutes = [
            '/staff/store',
            '/staff/update',
            '/staff/search',
            '/staff/collection',
            '/staff/remove',
            '/role/store',
            '/role/collection',
            '/role/remove'
        ]

        let taskManagerRoutes = [
            '/tasks/count/approve',
            '/tasks/count/report',
            '/tasks/count/block',
            '/tasks/count/issue',
            '/tasks/count/approve/flagged',
            '/tasks/count/report/flagged',
            '/tasks/count/block/flagged',
            '/tasks/count/issue/flagged',
            '/tasks/approve',
            '/tasks/approve/flagged',
            '/tasks/report',
            '/tasks/report/flagged',
            '/tasks/block',
            '/tasks/block/flagged',
            '/tasks/issue',
            '/tasks/issue/flagged',
            '/tasks/action',
            '/tasks/flag',
            '/tasks/unflag',
            '/tasks/flag/comments'
        ]

        try {
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
                return null
            }

            let roles = foundStaff.roles

            // strip path of parameters if it has any
            let pathWithoutParams = path.split('?')[0]
            
            let result : boolean
            // 3. Check if the staff has permission to access the route
            if (approveRoutes.includes(path) || approveRoutes.includes(pathWithoutParams)) {
                result = this.canAccessRoute(roles, 'approve')
            } else if (teamRoutes.includes(path) || teamRoutes.includes(pathWithoutParams)) {
                result = this.canAccessRoute(roles, 'team')
            } else if (taskManagerRoutes.includes(path) || taskManagerRoutes.includes(pathWithoutParams)) {
                result = this.canAccessRoute(roles, 'task-manager')
            } else {
                result = false
            }

            // If result === true then save the found staff
            if(result)
            {
                this._authStaff = foundStaff
            }
            return result

        } catch(error) {
            console.log(error)
            throw error
        }
    }

    getAuthStaff() : Staff | undefined
    {
        return this._authStaff
    }

    private hasRole(roles : Role[], product : string, role? :  string) {
        let foundByProduct = roles.filter((r : Role) => {
            return r.productName === product 
        })

        if(role)
        {
            return foundByProduct.filter((r : Role)=> {
                return r.roleName === role
            })
        }
        return foundByProduct
    }

    private canAccessRoute(roles : Role[], product : string, role? : string) {
        if (this.hasRole(roles, product, role).length > 0) {
            return true
        } else {
            return false
        }
    }
}
