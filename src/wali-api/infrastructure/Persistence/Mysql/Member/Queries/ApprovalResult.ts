import { Approval, ApprovalFactory } from './../../../../../domain'


export default class MemberResult
{
    private rows : { [key : string] : any }[]

    constructor(rows : { [key : string] : any }[])
    {
        this.rows = rows
    }

    retrieve()
    {
        return this.rows.map((row)=> {

            let approval = ApprovalFactory.build({
                memberId: row.memberID,
                photo1: row.photo1,
                photo2: row.photo2,
                photo3: row.photo3,
                photo4: row.photo4,
                photo5: row.photo5,
                photoVerification: row.photoVerification,
                statusMessage: row.statusMessage,
                longDescription: row.longDescription,
                staffFlagged: row.staffFlagged,
                attempts: row.attempts,
                lastUpdated: row.lastupdated,
                actioned: row.actioned
            })

            return approval
        })
    }
}
