
export default interface ISelectApprovalPendingMemberIdsQuery
{
    execute(memberIds? : number[]) : Promise<number[]>
}
