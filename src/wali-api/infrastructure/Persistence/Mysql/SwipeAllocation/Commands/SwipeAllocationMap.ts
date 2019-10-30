import { SwipeAllocation } from "../../../../../domain"

export default class SwipeAllocationMap {
    static deconstruct(swipeAllocation : SwipeAllocation) : { [key : string] : any }
    {
        return {
            memberID: swipeAllocation.memberId,
            allocationPermitted: swipeAllocation.allocationPermitted,
            positiveSwipes: swipeAllocation.positiveSwipes,
            negativeSwipes: swipeAllocation.negativeSwipes,
            limitMinutes: swipeAllocation.limitMinutes,
            bannedAt: swipeAllocation.bannedAt,
            swipeCredit: swipeAllocation.swipeCredit,
            totalSwipes: swipeAllocation.totalSwipes,
            claimedInstantMatch: swipeAllocation.claimedInstantMatch,
            claimedResetSwipes: swipeAllocation.claimedResetSwipes,
            timeStamp: swipeAllocation.timeStamp
        }
    }
}