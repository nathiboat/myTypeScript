import StaffLog from './StaffLog'

type StaffLogOptions = {
    staffId : number,
    eventCode : string,
    timeStamp? : string,
    memberId? : number,
    action? : string,
    ipAddress? : string,
    ipCountryCode? : string,
    id? : number
}

export default abstract class StaffLogFactory {

    static build(options: StaffLogOptions) {

        let log = new StaffLog(
            options.staffId,
            options.eventCode,
            options.timeStamp,
            options.memberId,
            options.action,
            options.ipAddress,
            options.ipCountryCode,
            options.id)

        return log
    }

}
