
type ReporteIssuePayload = {
    id: number,
    timeStamp: string,
    memberId: number,
    udid?: string,
    idfa?: string,
    emailAddress?: string,
    deviceOs?: string,
    deviceModel?: string,
    deviceVersion?: string,
    appVersion?: string,
    type?: string,
    comment?: any,
    attachmentUrl?: string,
    source?: string,
    consentedAtTimeStamp?: string,
    actioned?: boolean,
    flagged?: boolean
}

export default class ReportIssue 
{
    private _actioned : boolean

    private _flagged : boolean

    private constructor(
        public id: number,
        public timeStamp: string,
        public memberId: number,
        public udid?: string,
        public idfa?: string,
        public emailAddress?: string,
        public deviceOs?: string,
        public deviceModel?: string,
        public deviceVersion?: string,
        public appVersion?: string,
        public type?: string,
        public comment?: any,
        public attachmentUrl?: string,
        public source?: string,
        public consentedAtTimeStamp?: string,
        actioned? : boolean,
        flagged? : boolean) 
    {
        this._actioned = actioned || false
        this._flagged  = flagged || false
    }

    static build(payload: ReporteIssuePayload) 
    {
        return new ReportIssue(
            payload.id,
            payload.timeStamp,
            payload.memberId,
            payload.udid,
            payload.idfa,
            payload.emailAddress,
            payload.deviceOs,
            payload.deviceModel,
            payload.deviceVersion,
            payload.appVersion,
            payload.type,
            payload.comment,
            payload.attachmentUrl,
            payload.source,
            payload.consentedAtTimeStamp,
            payload.actioned,
            payload.flagged
        )
    }

    get actioned()
    {
        return this._actioned
    }

    get flagged()
    {
        return this._flagged
    }

    setActioned(value : boolean)
    {
        this._actioned = value
    }
}