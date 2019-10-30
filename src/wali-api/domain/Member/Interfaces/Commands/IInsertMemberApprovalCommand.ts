import { Approval } from './../../../../domain'

export default interface IInsertMemberApprovalCommand
{
    execute(approval : Approval) : Promise<null>
}
