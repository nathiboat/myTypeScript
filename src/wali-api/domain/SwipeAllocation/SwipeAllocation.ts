export default class SwipeAllocation {
    private  _profileId: number
    private  _allocationPermitted? : number
    private _positiveSwipes? : number
    private _negativeSwipes? : number
    private _bannedAt? : Date
    private _swipeCredit? : number
    private _totalSwipes? : number
    private _claimedInstantMatch? : Date
    private _claimedResetSwipes? : Date
    private _timeStamp? : Date
    private _limitMinutes? : number

    constructor(
        profileId : number,
        allocationPermitted? : number,
        positiveSwipes? : number,
        negativeSwipes? : number,
        bannedAt? : string,
        swipeCredit? : number,
        totalSwipes? : number,
        claimedInstantMatch? : string,
        claimedResetSwipes? : string,
        timeStamp? : string,
        limitMinutes? : number
    )
    {
        this._profileId = profileId
        this._allocationPermitted = allocationPermitted
        this._positiveSwipes = positiveSwipes
        this._negativeSwipes = negativeSwipes
        this._bannedAt = bannedAt? new Date(bannedAt) : undefined
        this._swipeCredit = swipeCredit
        this._totalSwipes = totalSwipes
        this._claimedInstantMatch = claimedInstantMatch? new Date(claimedInstantMatch) : undefined
        this._claimedResetSwipes = claimedResetSwipes? new Date(claimedResetSwipes) : undefined
        this._timeStamp = timeStamp ? new Date(timeStamp) : new Date()
        this._limitMinutes = limitMinutes
    }

    get memberId()
    {
        return this._profileId
    }

    get allocationPermitted()
    {
        return this._allocationPermitted
    }

    get positiveSwipes()
    {
        return this._positiveSwipes
    }

    get negativeSwipes()
    {
        return this._negativeSwipes
    }

    get bannedAt()
    {
        return this._bannedAt
    }

    get swipeCredit()
    {
        return this._swipeCredit
    }

    get totalSwipes()
    {
        return this._totalSwipes
    }

    get claimedInstantMatch()
    {
        return this._claimedInstantMatch
    }

    get claimedResetSwipes()
    {
        return this._claimedResetSwipes
    }

    get timeStamp()
    {
        return this._timeStamp
    }

    get limitMinutes() {
        return this._limitMinutes
    }
}