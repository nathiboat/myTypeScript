import StaffSession from './StaffSession'

type StaffSessionOptions = {
    staffId : number, 
    passwordToken? : string, 
    ipAddress : string, 
    ipCountryCode : string, 
    userAgent : string, 
    lastActive? : string, 
    created? : string, 
    updated? : string, 
    state? : string,
    id? : number
}

export default abstract class StaffSessionFactory
{
    static build(options : StaffSessionOptions)
    {
        let staffSession = new StaffSession(
            options.staffId,
            options.ipAddress,
            options.ipCountryCode,
            options.userAgent,
            options.passwordToken,
            options.lastActive,
            options.created,
            options.updated,
            options.state,
            options.id
        )

        return staffSession
    }
}