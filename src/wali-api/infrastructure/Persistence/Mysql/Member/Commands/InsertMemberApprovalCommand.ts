import { Context } from '../../index'
import ApprovalMap from './ApprovalMap'
import { Approval, IInsertMemberApprovalCommand } from './../../../../../domain'



export default class InsertMemberApprovalCommand implements IInsertMemberApprovalCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(approval : Approval)
    {
        this.context.connect()
        
        let columns = Object.keys(ApprovalMap.deconstruct(approval)).join(',')
        let values = Object.values(ApprovalMap.deconstruct(approval))

        await this.context.query(
            `INSERT INTO membersApproval (${ columns }) VALUES (?)`, [values])

        this.context.complete()
        return null
    }
}
