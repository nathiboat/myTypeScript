import {
    StaffFactory,
    IUpdateStaffCommand,
    ISelectRoleIncludeIdsQuery } from './../../../domain'
import { ISendEmail } from './../../Interfaces'
import { SendStaffUpdateEmail } from '../../../infrastructure/Email/Templates'
import { RoleNotFoundException, StaffNotFoundException } from './../../Exceptions'
import BaseResponse from './../../BaseResponse'
import ISelectOneStaffByQuery from "../../../domain/Staff/Interfaces/Queries/ISelectOneStaffByQuery"


export default class UpdateStaffService
{
    private _selectStaff : ISelectOneStaffByQuery

    private _updateStaff : IUpdateStaffCommand

    private _selectRole : ISelectRoleIncludeIdsQuery

    private _sendEmail : ISendEmail

    private _response : BaseResponse

    constructor(
        selectStaff : ISelectOneStaffByQuery,
        updateStaff : IUpdateStaffCommand,
        selectRole  : ISelectRoleIncludeIdsQuery,
        sendEmail   : ISendEmail,
        response : BaseResponse
    ){
        this._selectStaff = selectStaff
        this._updateStaff = updateStaff
        this._selectRole  = selectRole
        this._sendEmail   = sendEmail
        this._response    = response
    }

    async execute(roleIds : number[], id : number, name : string, email : string, description : string)
    {
        // 1. Find the roles with this ids
        let roles = await this._selectRole.execute(roleIds)

        // check if roles is array and longer then 0
        if(roles.length < 1)
        {
            throw new RoleNotFoundException('UpdateStaffService')
        }

        // 2. Select Staff to get token
        let selectedStaff = await this._selectStaff.execute({ id: id })
    
        if(!selectedStaff)
        {
            throw new StaffNotFoundException('UpdateStaffService')
        }
        
        // 3. If role found then create a Staff with that role and save it in database
        let staff = StaffFactory.build({
            id:          id,
            name:        name,
            email:       email,
            state:      'OK',
            description: description
        })
        roles.map(role => staff.addRole(role))
        
        await this._updateStaff.execute(staff)

        // 4. Create the email template
        let emailTemplate = new SendStaffUpdateEmail(staff.name)

        // 5. Send email to Staff
        await this._sendEmail.execute(
            email,
            'support@muzmatch.com',
            emailTemplate.subject,
            emailTemplate.content)

        return this._response.body(staff)
    }
}
