import {
    StaffFactory,
    IInsertStaffCommand,
    ISelectOneStaffByQuery,
    ISelectRoleIncludeIdsQuery } from './../../../domain'
import { ISendEmail } from './../../Interfaces'
import { SendWelcomeEmail } from '../../../infrastructure/Email/Templates'
import BaseResponse from './../../BaseResponse'
import { StaffNotFoundException, RoleNotFoundException } from './../../Exceptions'


export default class RegisterStaffService
{
    private _insertStaff : IInsertStaffCommand

    private _selectRole : ISelectRoleIncludeIdsQuery

    private _selectStaff : ISelectOneStaffByQuery

    private _sendEmail : ISendEmail

    private _response : BaseResponse

    constructor(
        insertStaff : IInsertStaffCommand,
        selectRole  : ISelectRoleIncludeIdsQuery,
        selectStaff : ISelectOneStaffByQuery,
        sendEmail   : ISendEmail,
        response : BaseResponse
    ){
        this._insertStaff = insertStaff
        this._selectRole  = selectRole
        this._selectStaff = selectStaff
        this._sendEmail   = sendEmail
        this._response    = response
    }

    async execute(roleIds : number[], name : string, email : string, description : string)
    {
        // 1. Find the role with this id
        let roles = await this._selectRole.execute(roleIds)

        // check if roles is array and longer then 0
        if(roles.length < 1)
        {
            throw new RoleNotFoundException('RegisterStaffService')
        }

        // 2. If role found then create a Staff with that role and save it in database
        let staff = StaffFactory.build({
            name:        name,
            email:       email,
            state:      'OK',
            description: description
        })
        
        roles.map(role => staff.addRole(role))
        
        await this._insertStaff.execute(staff)
        
        // 3. Retrieve the staff by email to get it's id
        let foundStaff = await this._selectStaff.execute({ email: email })
        
        if(!foundStaff)
        {
            throw new StaffNotFoundException('RegisterStaffService')
        }

        // 4. Create the email template
        let emailTemplate = new SendWelcomeEmail(staff.name)

        // 5. Send email to Staff
        await this._sendEmail.execute(
            email,
            'support@muzmatch.com',
            emailTemplate.subject,
            emailTemplate.content)

        return this._response.body(foundStaff)
    }
}
