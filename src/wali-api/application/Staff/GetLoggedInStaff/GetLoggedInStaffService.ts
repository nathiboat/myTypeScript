import { ICheckTokenService } from './../../'
import { ISelectOneStaffByQuery, ISelectStaffSessionQuery } from './../../../domain'
import BaseResponse from './../../BaseResponse'
import { StaffNotFoundException } from './../../Exceptions'


export default class GetLoggedInStaffService
{
    private _selectStaff : ISelectOneStaffByQuery

    private _checkToken : ICheckTokenService

    private _selectStaffSession : ISelectStaffSessionQuery

    private _response : BaseResponse

    constructor(
        selectStaff : ISelectOneStaffByQuery,
        checkToken : ICheckTokenService,
        selectStaffSession : ISelectStaffSessionQuery,
        response : BaseResponse
    ){
        this._selectStaff        = selectStaff
        this._checkToken         = checkToken
        this._selectStaffSession = selectStaffSession
        this._response           = response
    }

    async execute(token : string)
    {
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
            let foundStaff = await this._selectStaff.execute({ id: session.staffId })
            if(!foundStaff)
            {
                throw new StaffNotFoundException('GetLoggedInStaffService')
            }

            // Add token to the staff
            foundStaff.setToken(token)
            
            return this._response.body(foundStaff)

        } catch(error) {
            throw error
        }
    }
}
