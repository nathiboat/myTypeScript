import SwipeAllocation from './SwipeAllocation'

type SwipeAllocationOptions = {
    profileId: number,
    allocationPermitted? : number,
    positiveSwipes? : number,
    negativeSwipes? : number,
    bannedAt? : string,
    swipeCredit? : number,
    totalSwipes? : number,
    claimedInstantMatch? : string,
    claimedResetSwipes? : string,
    timeStamp? : string
}

export default class SwipeAllocationFactory {


    static build(options : SwipeAllocationOptions) {
        return new SwipeAllocation(
            options.profileId,
            options.allocationPermitted,
            options.positiveSwipes,
            options.negativeSwipes,
            options.bannedAt,
            options.swipeCredit,
            options.totalSwipes,
            options.claimedInstantMatch,
            options.claimedResetSwipes,
            options.timeStamp
        ) 
    }
}