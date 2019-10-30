import { IUpdateMemberRewardTransaction } from './../../wali-api/domain'
import Datastore from 'nedb'


export default class LocalUpdateMemberRewardTransaction implements IUpdateMemberRewardTransaction
{
    private _instantMatch : number = 0

    private _swipe : number = 0

    private _premiumDays : number = 0

    private _memberId? : number


    private _db : Datastore

    constructor(db : Datastore)
    {
        this._db = db
    }

    async execute()
    {
        this._db.insert({
            instantMatch: this._instantMatch,
            swipe: this._swipe,
            premiumDays: this._premiumDays,
            memberId: this._memberId
        })
        return null
    }

    setMemberInstantMatches(memberId : number, addNumberOfMatches : number)
    {
        this._memberId     = memberId
        this._instantMatch = addNumberOfMatches
    }

    setMemberPremiumForDays(memberId: number, numberOfDays : number)
    {
        this._memberId    = memberId
        this._premiumDays = numberOfDays
    }

    setMemberSwipeAllocation(memberId : number, swipeCredit : number)
    {
        this._memberId = memberId
        this._swipe    = swipeCredit
    }
}