
export default interface IUpdateMemberInstantMatchCreditCommand
{
    execute(id : number, addNumberOfMatches : number) : Promise<null>
}