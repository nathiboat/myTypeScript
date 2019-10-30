import Report from './Report'

type ReportOptions = {
    memberId: number,
    issueType?: string,
    reportingMemberId: number,
    reportingMemberComment?: string,
    reportingMemberBlocked?: boolean,
    reportingAttachmentURL?: string,
    source?: string,
    adminDecisionValidReport: number,
    adminComment?: string,
    actioned: boolean,
    timeStamp?: string,
    id?: number
}

export default abstract class ReportFactory
{
    static build(options : ReportOptions)
    {
        let report = new Report(
            options.memberId,
            options.reportingMemberId,
            options.adminDecisionValidReport,
            options.actioned,
            options.issueType,
            options.reportingMemberBlocked,
            options.reportingMemberComment,
            options.reportingAttachmentURL,
            options.source,
            options.adminComment,
            options.timeStamp,
            options.id
        )

        return report
    }
}
