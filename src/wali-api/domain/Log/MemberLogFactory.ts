import MemberLog from './MemberLog'

type MemberLogOptions = {
    memberId : number,
    udid? : string,
    idfa? : string,
    eventCode : string,
    action : string,
    timeStamp? : string,
    gpsLatitude? : string,
    gpsLongitude? : string,
    appVersion? : string,
    mobileOsVersion? : string,
    mobileOs? : string,
    serverRemoteAddress? : string,
    id? : number
}

export default abstract class MemberLogFactory {

    static build(options: MemberLogOptions) {

        let log = new MemberLog(
            options.memberId,
            options.eventCode,
            options.action,
            options.timeStamp,
            options.udid,
            options.idfa,
            options.gpsLatitude,
            options.gpsLongitude,
            options.appVersion,
            options.mobileOsVersion,
            options.mobileOs,
            options.serverRemoteAddress,
            options.id)

        return log
    }
}
