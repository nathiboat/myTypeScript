
import { MemberReport } from './../../../../Domain'

type DatabaseRow = { [key: string]: any }



export default abstract class MembersReportTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            return MemberReport.build({
                id: row.id,
                reportingMemberBlocked: row.reportingMemberBlocked,
                memberId: row.memberID,
                issueType: row.issueType,
                reportingMemberId: row.reportingMemberID,
                reportingMemberComment: row.reportingMemberComment,
                reportingAttachmentUrl: row.reportingAttachmentURL,
                timeStamp: row.timeStamp,
                source: row.source,
                adminDecisionValidReport: row.adminDecisionValidReport,
                adminComment: row.adminComment,
                actioned: row.actioned === 1 ? true : false,
                flagged: row.wali_flagged === 1 ? true : false
            })
        })
    }

    static toRaw(model: MemberReport) 
    {
        return {
            id: model.id,
            reportingMemberBlocked: model.reportingMemberBlocked,
            memberID: model.memberId,
            issueType: model.issueType,
            reportingMemberID: model.reportingMemberId,
            reportingMemberComment: model.reportingMemberComment,
            reportingAttachmentURL: model.reportingAttachmentUrl,
            timeStamp: model.timeStamp,
            source: model.source,
            adminDecisionValidReport: model.adminDecisionValidReport,
            adminComment: model.adminComment,
            actioned: model.actioned,
            wali_flagged: model.flagged
        }
    }
}
