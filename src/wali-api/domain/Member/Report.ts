export default class Report
{
    private _id?: number
    private _memberId: number
    private _issueType?: string
    private _reportingMemberId: number
    private _reportingMemberComment?: string
    private _reportingMemberBlocked?: boolean
    private _reportingAttachmentURL?: string
    private _timeStamp?: Date
    private _source?: string
    private _adminDecisionValidReport: number
    private _adminComment?: string
    private _actioned: boolean


    constructor(
        memberId: number,
        reportingMemberId: number,
        adminDecisionValidReport: number,
        actioned: boolean,
        issueType?: string,
        reportingMemberBlocked?: boolean,
        reportingMemberComment?: string,
        reportingAttachmentURL?: string,
        source?: string,
        adminComment?: string,
        timeStamp?: string,
        id?: number
    )
    {
        this._memberId = memberId
        this._issueType = issueType
        this._reportingMemberId = reportingMemberId
        this._reportingMemberComment = reportingMemberComment
        this._reportingMemberBlocked = reportingMemberBlocked? reportingMemberBlocked: false
        this._reportingAttachmentURL = reportingAttachmentURL
        this._timeStamp = timeStamp ? new Date(timeStamp) : new Date()
        this._source = source
        this._adminDecisionValidReport = adminDecisionValidReport
        this._adminComment = adminComment
        this._actioned = actioned
        this._id = id
    }

    get id()
    {
        return this._id
    }

    get memberId()
    {
        return this._memberId
    }

    get issueType()
    {
        return this._issueType
    }

    get reportingMemberId()
    {
        return this._reportingMemberId
    }

    get reportingMemberComment()
    {
        return this._reportingMemberComment
    }

    get reportingMemberBlocked()
    {
        return this._reportingMemberBlocked
    }

    get reportingAttachmentURL()
    {
        return this._reportingAttachmentURL
    }

    get timeStamp()
    {
        return this._timeStamp
    }

    get source()
    {
        return this._source
    }

    get adminDecisionValidReport()
    {
        return this._adminDecisionValidReport
    }

    get adminComment()
    {
        return this._adminComment
    }

    get actioned()
    {
        return this._actioned
    }



}
