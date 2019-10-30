
import { MemberApprove } from './../../../../Domain'

type DatabaseRow = { [key: string]: any }



export default abstract class MemberApproveTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            return MemberApprove.build({
                memberId: row.memberID,
                staffFlagged: row.staffFlagged,
                attempts: row.attempts,
                photoOne: row.photo1,
                photoTwo: row.photo2,
                photoThree: row.photo3,
                photoFour: row.photo4,
                photoFive: row.photo5,
                photoVerification: row.photoVerification,
                statusMessage: row.statusMessage,
                longDescription: row.longDescription,
                lastUpdated: row.lastUpdated,
                actioned: row.actioned === 1 ? true : false,
                flagged: row.wali_flagged === 1 ? true : false
            })
        })
    }

    static toRaw(model: MemberApprove) 
    {
        return {
            memberId: model.memberId,
            staffFlagged: model.staffFlagged,
            attempts: model.attempts,
            photo1: model.photoOne,
            photo2: model.photoTwo,
            photo3: model.photoThree,
            photo4: model.photoFour,
            photo5: model.photoFive,
            photoVerification: model.photoVerification,
            statusMessage: model.statusMessage,
            longDescription: model.longDescription,
            lastUpdated: model.lastUpdated,
            actioned: model.actioned,
            wali_flagged: model.flagged
        }
    }
}
