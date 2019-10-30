import { ICheckPasswordHashService } from './../../Interfaces'
import { 
    ISelectAllStaffQuery, 
    IUpdateStaffCommand, 
    ISelectOneStaffByQuery, 
    IInsertStaffLogCommand, 
    StaffLogFactory, 
    StaffSession, 
    ISelectStaffSessionQuery, 
    IUpdateStaffSessionCommand} from './../../../domain'
import BaseResponse from './../../BaseResponse'
import { StaffNotFoundException } from './../../Exceptions'


export default class LoginStaffService
{
    private _selectStaffs : ISelectAllStaffQuery

    private _compareHashPassword : ICheckPasswordHashService

    private _selectOneStaff : ISelectOneStaffByQuery

    private _updateStaff : IUpdateStaffCommand

    private _insertStaffLog : IInsertStaffLogCommand

    private _selectStaffSession : ISelectStaffSessionQuery

    private _updateStaffSession : IUpdateStaffSessionCommand

    private _response : BaseResponse


    constructor(
        selectStaffs : ISelectAllStaffQuery,
        compareHashPassword : ICheckPasswordHashService,
        selectOneStaff : ISelectOneStaffByQuery,
        updateStaff : IUpdateStaffCommand,
        insertStaffLog : IInsertStaffLogCommand,
        selectStaffSession : ISelectStaffSessionQuery,
        updateStaffSession : IUpdateStaffSessionCommand,
        response : BaseResponse
    ){
        this._selectStaffs         = selectStaffs
        this._compareHashPassword  = compareHashPassword
        this._selectOneStaff       = selectOneStaff
        this._updateStaff          = updateStaff
        this._insertStaffLog       = insertStaffLog
        this._selectStaffSession   = selectStaffSession
        this._updateStaffSession   = updateStaffSession
        this._response             = response
    }

    async execute(password : string, ipAddress: string, userAgent: string) : Promise<{ [key : string] : any }>
    {
        // 1 Get the staff from from the table, based on the password
        let allStaffs = await this._selectStaffs.execute()
        let usedPassword : string
        
        // Loop and check with compare hashed password
        for (let staff of allStaffs) {
            if(typeof staff.password === 'string' && this._compareHashPassword.execute(password, staff.password)) {
                usedPassword = staff.password
            }
        }
        
        let foundStaff = await this._selectOneStaff.execute({ password: usedPassword! })
        
        if(!foundStaff || !foundStaff.id)
        {
            throw new StaffNotFoundException('Staff was not found in the database')
        }

        // 2 Look in the sessions table to find the staff's token
        let sessions = await this._selectStaffSession.execute({ 
            staffID: foundStaff.id,
            ipAddress: ipAddress,
            userAgent: userAgent
        })

        // 3 Take the token from the session or create a new one if none found
        let token : string
        let staffSession : StaffSession
        if(sessions.length === 0)
        {
            throw Error('No session found')
        }

        staffSession = sessions[0]
        if(!staffSession.passwordToken)
        {
            throw Error('Staff session has NULL token')
        }
        token = staffSession.passwordToken

        staffSession.setState('OK')

        // Update the staff token
        await this._updateStaffSession.execute(staffSession)

        // Remove the used password
        foundStaff.removePassword()
        await this._updateStaff.execute(foundStaff)

        let action = {
            ipAddress: ipAddress,
            userAgent: userAgent,
        }

        await this._insertStaffLog.execute(StaffLogFactory.build({
            staffId: foundStaff.id!,
            eventCode: 'SIGN_IN_EMAIL',
            action: JSON.stringify(action)
        }))

        // Add token to the staff so we don't do 2 calls from front end
        foundStaff.setToken(token)

        // 4 Send the token back
        return this._response.body(foundStaff)
    }
}
