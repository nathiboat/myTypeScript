export default interface IUpdateMemberRewardTransaction
{
    execute() : Promise<null>

    setMemberInstantMatches(id : number, addNumberOfMatches : number) : void

    setMemberPremiumForDays(id: number, numberOfDays : number) : void

    setMemberSwipeAllocation(memberId : number, swipeCredit : number) : void
}