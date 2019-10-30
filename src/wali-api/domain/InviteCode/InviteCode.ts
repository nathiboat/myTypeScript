export default class InviteCode {

    private _inviteCode : string

    private _state? : string

    private _description? : string

    private _createdAtTimeStamp? : Date

    private _expiresAtTimeStamp? : Date

    private _premiumForDays? : number

    private _extraSwipes? : number

    private _instantMatches? : number

    private _fallbackExtraSwipes? : number

    private _fallbackInstantMatches? : number

    private _id? : number

    constructor (
        inviteCode : string,
        state? : string,
        description? : string,
        createdAtTimeStamp? : string,
        expiresAtTimeStamp? : string,
        premiumForDays? : number,
        extraSwipes? : number,
        instantMatches? : number,
        fallbackExtraSwipes? : number,
        fallbackInstantMatches? : number,
        id?: number
    ) {
        this._inviteCode             = inviteCode
        this._state                  = state
        this._description            = description
        this._createdAtTimeStamp     = createdAtTimeStamp ? new Date(createdAtTimeStamp) : undefined
        this._expiresAtTimeStamp     = expiresAtTimeStamp ? new Date(expiresAtTimeStamp) : undefined
        this._premiumForDays         = premiumForDays
        this._extraSwipes            = extraSwipes
        this._instantMatches         = instantMatches
        this._fallbackExtraSwipes    = fallbackExtraSwipes
        this._fallbackInstantMatches = fallbackInstantMatches
        this._id                     = id
    }

    get premiumForDays()
    {
        return this._premiumForDays
    }

    get extraSwipes()
    {
        return this._extraSwipes
    }

    get instantMatches()
    {
        return this._instantMatches
    }

    get fallbackExtraSwipes()
    {
        return this._fallbackExtraSwipes
    }

    get fallbackInstantMatches()
    {
        return this._fallbackInstantMatches
    }

    setPremiumForDays(value? : number)
    {
        this._premiumForDays = value
    }

    removePremiumForDays()
    {
        this._premiumForDays = undefined
    }

    setExtraSwipes(value? : number)
    {
        this._extraSwipes = value
    }

    removeExtraSwipes()
    {
        this._extraSwipes = undefined
    }

    setInstantMatches(value? : number)
    {
        this._instantMatches = value
    }

    removeInstantMatches()
    {
        this._instantMatches = undefined
    }
}