export default interface IUpdateSwipeAllocationCommand {
    execute(memberId : number, swipeCredit: number) : Promise<null>
}