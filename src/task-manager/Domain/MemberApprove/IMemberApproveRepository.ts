import MemberApprove from './MemberApprove'


export default interface IMemberApproveRepository
{
    findOne(id : number) : Promise<MemberApprove>

    allActioned() : Promise<MemberApprove[]>

    updateActioned(id : number, value : boolean) : Promise<boolean>

    updateFlagged(id : number, value : boolean) : Promise<boolean>
}