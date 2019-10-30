import { Approval } from './../../../../domain'


export default interface IUpdateMemberApprovalCommand
{
    execute(approval : Approval) : Promise<null>
}
