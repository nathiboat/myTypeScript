import BaseResponse from './../Shared/BaseResponse'
import { Member } from './../../Domain'

export default class GetApproveFlagQueueResponse extends BaseResponse
{
    body(member : Member, date : string)
    {
        return {
            ticketType: 'approve',
            flag: true,
            ticket: {
                id: member.memberId,
                date: date
            },
            firstMember: {
                memberId: member.memberId,
                memberHashId: member.hashMemberId,
                photo: member.photoOne,
                fullName: member.nickname
            },
            secondMember: null
        }
    }
}