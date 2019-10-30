import { Report } from "../../../../../domain"

export default class ReportMap
{
    static deconstruct(report : Report) : { [key : string] : any }
    {
        return {
            memberID: report.memberId,
            reportingMemberID: report.reportingMemberId,
            reportingMemberComment: report.reportingMemberComment,
            reportingMemberBlocked: report.reportingMemberBlocked,
            adminDecisionValidReport: report.adminDecisionValidReport,
            actioned: report.actioned,
            issueType: report.issueType,
            reportingAttachmentURL: report.reportingAttachmentURL,
            source: report.source,
            adminComment: report.adminComment,
            timeStamp: report.timeStamp
        }
    }
}
