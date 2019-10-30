import { Approval } from "../../../../../domain"

export default class ApprovalMap
{
    static deconstruct(approval : Approval) : { [key : string] : any }
    {
        return {
            memberID: approval.memberId,
            photo1: approval.photo1 ? 1: 0,
            photo2: approval.photo2 ? 1: 0,
            photo3: approval.photo3 ? 1: 0,
            photo4: approval.photo4 ? 1: 0,
            photo5: approval.photo5 ? 1: 0,
            photoVerification: approval.photoVerification ? 1: 0,
            statusMessage: approval.statusMessage ? 1: 0,
            longDescription: approval.longDescription ? 1: 0,
            staffFlagged: approval.staffFlagged ? 1: 0,
            attempts: approval.attempts,
            lastUpdated: approval.lastUpdated,
            actioned: approval.actioned ? 1 : 0
        }
    }
}
