
type MemberReportPayload = {
    id: number,
    reportingMemberBlocked: number,
    memberId: number,
    issueType?: string,
    reportingMemberId?: number,
    reportingMemberComment?: string,
    reportingAttachmentUrl?: string,
    timeStamp?: string,
    source?: string,
    adminDecisionValidReport?: number,
    adminComment?: string,
    actioned?: boolean,
    flagged?: boolean
}

export default class MemberReport 
{
    private _actioned : boolean

    private _flagged : boolean

    private constructor(
        public id: number,
        public reportingMemberBlocked: number,
        public memberId: number,
        public issueType?: string,
        public reportingMemberId?: number,
        public reportingMemberComment?: string,
        public reportingAttachmentUrl?: string,
        public timeStamp?: string,
        public source?: string,
        public adminDecisionValidReport?: number,
        public adminComment?: string,
        actioned? : boolean,
        flagged? : boolean) 
    {
        this._actioned = actioned || false
        this._flagged  = flagged || false
    }

    static build(payload: MemberReportPayload) 
    {
        return new MemberReport(
            payload.id,
            payload.reportingMemberBlocked,
            payload.memberId,
            payload.issueType,
            payload.reportingMemberId,
            payload.reportingMemberComment,
            payload.reportingAttachmentUrl,
            payload.timeStamp,
            payload.source,
            payload.adminDecisionValidReport,
            payload.adminComment,
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