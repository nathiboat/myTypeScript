import { MemberLog } from '../../../../../domain'

export default class MemberLogMap
{
    static deconstruct(memberLog : MemberLog) : { [key : string] : any }
    {
        return {
            memberID: memberLog.memberId,
            UDID: memberLog.udid,
            IDFA: memberLog.idfa,
            eventCode: memberLog.eventCode,
            action: memberLog.action,
            timeStamp: memberLog.timeStamp,
            GPSLATITUDE: memberLog.gpsLatitude,
            GPSLONGITUDE: memberLog.gpsLongitude,
            appVersion: memberLog.appVersion,
            mobileOSVersion: memberLog.mobileOsVersion,
            mobileOS: memberLog.mobileOs,
            SERVER_REMOTE_ADDR: memberLog.serverRemoteAddress,
        }
    }
}
