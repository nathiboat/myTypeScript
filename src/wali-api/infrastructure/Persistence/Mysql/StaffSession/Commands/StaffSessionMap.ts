import { StaffSession } from '../../../../../domain'

export default class StaffSessionMap
{
    static deconstruct(staffSession : StaffSession) : { [key : string] : any }
    {
        return {
            staffID: staffSession.staffId,
            passwordToken: staffSession.passwordToken,
            ipAddress: staffSession.ipAddress,
            ipCountryCode: staffSession.ipCountryCode,
            userAgent: staffSession.userAgent,
            lastActive: staffSession.lastActive,
            created: staffSession.created,
            updated: staffSession.updated,
            state: staffSession.state
        }
    }
}
