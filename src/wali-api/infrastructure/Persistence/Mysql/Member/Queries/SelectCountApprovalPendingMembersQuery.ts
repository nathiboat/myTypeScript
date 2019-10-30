import { Context } from './../../'
import { ISelectCountApprovalPendingMembersQuery } from './../../../../../domain'


type CustomResult = { count : number }


export default class SelectCountApprovalPendingMembersQuery implements ISelectCountApprovalPendingMembersQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute()
    {
        this.context.connect()
        
        let rows =  await this.context.query(
            `SELECT COUNT(m.memberID) AS count FROM members m LEFT JOIN membersApproval a ON (a.memberID = m.memberID)
                WHERE m.profileCreated > 0 AND m.permanentlyBlocked = 0 AND m.approved = 0 AND
                    (m.profileReviewedByAdmin=0 or (
                        (m.profileReviewedByAdmin=1 and m.profileCreated=1 and (m.photo1 is not null and m.photoVerification is not null) or
                        (m.profileReviewedByAdmin=1 and m.profileCreated=2 and (m.photo1 is not null and m.photoVerification is not null and m.longDescription is not null)))))
                    AND (
                        (m.photo1 IS NOT NULL AND a.photo1 IS NULL) OR
                        (m.photo2 IS NOT NULL AND a.photo2 IS NULL) OR
                        (m.photo3 IS NOT NULL AND a.photo3 IS NULL) OR
                        (m.photo4 IS NOT NULL AND a.photo4 IS NULL) OR
                        (m.photo5 IS NOT NULL AND a.photo5 IS NULL) OR
                        (m.photoVerification IS NOT NULL AND a.photoVerification IS NULL) OR
                        (m.statusMessage IS NOT NULL AND a.statusMessage IS NULL) OR
                        (m.longDescription IS NOT NULL AND a.longDescription IS NULL))
                    AND IFNULL(a.staffFlagged,0) = 0`)

        this.context.complete()
        return rows.map((row : CustomResult)=> { return row.count })[0]
    }
}
