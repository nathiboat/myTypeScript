import { Approval } from './../../../../domain'


export default interface ISelectMemberApprovalByIdQuery
{
    execute(id : number) : Promise<Approval[]>
}
