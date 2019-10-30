import { ISendEmail, IGenerateRandomPassword } from './../'
import { SendLoginPasswordEmail } from './../../infrastructure/Email/Templates'
import { 
    IUpdateStaffCommand, 
    ISelectOneStaffByQuery, 
    IInsertStaffSessionCommand, 
    StaffSessionFactory, 
    ISelectStaffSessionQuery,
    IUpdateStaffSessionCommand } from './../../domain'
import { StaffNotFoundException } from './../Exceptions'
import { IHashPasswordService, IGenerateToken } from "../Interfaces"


export default class GeneratePasswordService
{
    private _selectStaff : ISelectOneStaffByQuery

    private _hashPassword : IHashPasswordService

    private _updateStaff : IUpdateStaffCommand

    private _sendEmail : ISendEmail

    private _generatePassword : IGenerateRandomPassword

    private _insertStaffSession : IInsertStaffSessionCommand

    private _generateToken : IGenerateToken

    private _selectStaffSession : ISelectStaffSessionQuery

    private _updateStaffSession : IUpdateStaffSessionCommand


    private _masterEmail? : string

    private _masterPassword? : string


    constructor(
        selectStaff : ISelectOneStaffByQuery,
        hashPassword : IHashPasswordService,
        updateStaff : IUpdateStaffCommand,
        sendEmail : ISendEmail,
        generatePassword : IGenerateRandomPassword,
        insertStaffSession : IInsertStaffSessionCommand,
        generateToken : IGenerateToken,
        selectStaffSession : ISelectStaffSessionQuery,
        updateStaffSession : IUpdateStaffSessionCommand,
        masterEmail? : string,
        masterPassword? : string
    ){
        this._selectStaff        = selectStaff
        this._hashPassword       = hashPassword
        this._updateStaff        = updateStaff
        this._sendEmail          = sendEmail
        this._generatePassword   = generatePassword
        this._insertStaffSession = insertStaffSession
        this._generateToken      = generateToken
        this._selectStaffSession = selectStaffSession
        this._updateStaffSession = updateStaffSession

        // optional parameters
        this._masterEmail    = masterEmail
        this._masterPassword = masterPassword
    }

    async execute(email : string, ipAddress: string, userAgent: string, countryCode : string)
    {
        // 1. Find staff by email
        let foundStaff = await this._selectStaff.execute({ email : email })
        
        if(!foundStaff)
        {
            throw new StaffNotFoundException('GeneratePasswordService')
        }

        if(!foundStaff.id)
        {
            throw Error('Staff id is undefined')
        }

        // if emailMaster and emailPassword not undefined and
        // if current email provided is same as masterEmail then password is masterPassword
        let password : string = ''
        if(this.isMasterStaff(email))
        {
            password = this._masterPassword!
        } else {
            // 3. Generate password,
            password = this._generatePassword.execute()
        }

        // 4. hash password
        let hashPassword = this._hashPassword.execute(password)

        // 5. Save the password for the Staff
        foundStaff.setPassword(hashPassword)
        this._updateStaff.execute(foundStaff)

        // Check if there is already a session from same device, ip address and staff id
        let sessions = await this._selectStaffSession.execute({ 
            staffID: foundStaff.id,
            ipAddress: ipAddress,
            userAgent: userAgent
        })

        // Generate new token
        let token = this._generateToken.execute(foundStaff.name!, foundStaff.id)
        if(sessions.length > 0)
        {
            let staffSession = sessions[0]
            staffSession.setState('LOGIN')
            staffSession.setToken(token)
            await this._updateStaffSession.execute(staffSession)

        } else {
            let staffSession = StaffSessionFactory.build({
                staffId: foundStaff.id,
                ipAddress: ipAddress,
                passwordToken: token,
                ipCountryCode: countryCode,
                userAgent: userAgent,
                state: 'LOGIN'
            })
            await this._insertStaffSession.execute(staffSession)
        }

        // If staff is not Master Staff then send email with generated password
        if(!this.isMasterStaff(email))
        {
            // 6. Create the email template
            let emailTemplate = new SendLoginPasswordEmail(foundStaff.name, password)

            // 7. Send email to Staff
            this._sendEmail.execute(
                email,
                'support@muzmatch.com',
                emailTemplate.subject,
                emailTemplate.content,
                emailTemplate.html)
        }

        return true
    }

    private isMasterStaff(email : string)
    {
        return this._masterEmail && this._masterPassword && email === this._masterEmail
    }
}
