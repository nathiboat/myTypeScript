import Approval from './Approval'

type ApprovalOptions = {
    memberId: number,
    photo1 : boolean,
    photo2 : boolean,
    photo3 : boolean,
    photo4 : boolean,
    photo5 : boolean,
    photoVerification : boolean,
    statusMessage : boolean,
    longDescription : boolean,
    staffFlagged : boolean,
    attempts : number,
    lastUpdated? : string,
    profileCreated?: number,
    actioned? : boolean
}

export default abstract class ApprovalFactory
{
    static build(options : ApprovalOptions)
    {
        let approval = new Approval(
            options.memberId,
            options.photo1,
            options.photo2,
            options.photo3,
            options.photo4,
            options.photo5,
            options.photoVerification,
            options.statusMessage,
            options.longDescription,
            options.staffFlagged,
            options.attempts,
            options.lastUpdated,
            options.actioned)

        return approval
    }
}
