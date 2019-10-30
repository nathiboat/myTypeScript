import { StaffLog } from '../../../../../domain'

export default class StaffLogMap
{
    static deconstruct(staffLog : StaffLog) : { [key : string] : any }
    {
        return {
            staffID: staffLog.staffId,
            eventCode: staffLog.eventCode,
            memberID: staffLog.memberId,
            action: staffLog.action,
            timeStamp: staffLog.timeStamp,
            ipAddress: staffLog.ipAddress,
            ipCountryCode: staffLog.ipCountryCode
        }
    }
}
