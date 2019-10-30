import BaseResponse from './../Shared/BaseResponse'
import { Match, Member, MemberReport } from './../../Domain'

export default class GetReportQueueResponse extends BaseResponse
{
    body(report : MemberReport, taskType : string, reportingMember : Member, reportedMember : Member, match? : Match)
    {
        return {
            ticketType: taskType,
            ticket: {
                id: report.id,
                date: report.timeStamp,
                attachment: report.reportingAttachmentUrl,
                comment: report.reportingMemberComment,
                issue: report.issueType
            },
            firstMember: {
                memberId: reportingMember.memberId,
                memberHashId: reportingMember.hashMemberId,
                photo: reportingMember.photoOne,
                fullName: reportingMember.nickname
            },
            secondMember: {
                memberId: reportedMember.memberId,
                memberHashId: reportedMember.hashMemberId,
                photo: reportedMember.photoOne,
                fullName: reportedMember.nickname,
                matchId: match ? match.matchId : null
            }
        }
    }
}