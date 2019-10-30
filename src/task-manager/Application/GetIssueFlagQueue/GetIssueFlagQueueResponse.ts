import BaseResponse from './../Shared/BaseResponse'
import { ReportIssue, Member } from './../../Domain'

export default class GetIssueFlagQueueResponse extends BaseResponse
{
    body(issue: ReportIssue, member? : Member)
    {
        return {
            ticketType: 'issue',
            flag: true,
            ticket: {
                id: issue.id,
                comment: issue.comment,
                issue: issue.type,
                attachment: issue.attachmentUrl ? issue.attachmentUrl : null,
                email: member ? null : issue.emailAddress,
                date: issue.timeStamp
            },
            firstMember: member ? {
                memberId: member.memberId,
                memberHashId: member.hashMemberId,
                photo: member.photoOne,
                fullName: member.nickname
            } : null
        }
    }
}