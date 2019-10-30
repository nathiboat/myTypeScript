
type StaffLogPayload = {
    id?: number,
    staffId: number,
    eventCode: string,
    timeStamp?: string,
    memberId?: number,
    action?: string,
    ipAddress?: string,
    ipCountryCode?: string
}

export default class StaffLog 
{
    private _timeStamp : Date

    private constructor(
        public staffId: number,
        public eventCode: string,
        timeStamp?: string,
        public memberId?: number,
        public action?: string,
        public ipAddress?: string,
        public ipCountryCode?: string,
        public id?: number) 
    {
        this._timeStamp = timeStamp ? new Date(timeStamp) : new Date()
    }

    static build(payload: StaffLogPayload) 
    {
        return new StaffLog(
            payload.staffId,
            payload.eventCode,
            payload.timeStamp,
            payload.memberId,
            payload.action,
            payload.ipAddress,
            payload.ipCountryCode,
            payload.id
        )
    }

    get timeStamp()
    {
        return this._timeStamp
    }
}