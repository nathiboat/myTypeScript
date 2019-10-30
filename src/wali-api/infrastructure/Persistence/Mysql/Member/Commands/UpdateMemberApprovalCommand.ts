import { Context } from '../../index'
import ApprovalMap from './ApprovalMap'
import { Approval, IUpdateMemberApprovalCommand } from './../../../../../domain'



export default class UpdateMemberApprovalCommand implements IUpdateMemberApprovalCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(approval : Approval)
    {
        this.context.connect()
        
        let pairs = Object.keys(ApprovalMap.deconstruct(approval)).map((key)=> {
            return `${ key } = ?`
        }).join(',')

        let values = Object.values(ApprovalMap.deconstruct(approval))
        
        await this.context.query(
            `UPDATE membersApproval
             SET ${ pairs }
             WHERE memberID = ?`, [ ...values, approval.memberId])
        this.context.complete()
        return null
    }
}
