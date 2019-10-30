import { Context } from './../../'
import ApprovalResult from './ApprovalResult'
import { ISelectMemberApprovalByIdQuery } from './../../../../../domain'


/*
    Get a Member by ID
*/

export default class SelectMemberApprovalByIdQuery implements ISelectMemberApprovalByIdQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute(id : number)
    {
        this.context.connect()

        let rows =  await this.context.query(
            `SELECT
                memberID ,
                photo1,
                photo2,
                photo3,
                photo4,
                photo5,
                photoVerification,
                statusMessage,
                longDescription,
                staffFlagged,
                attempts,
                lastUpdated
             FROM membersApproval
             WHERE memberID = ?`, [id])

        this.context.complete()
        return new ApprovalResult(rows).retrieve()
    }
}
