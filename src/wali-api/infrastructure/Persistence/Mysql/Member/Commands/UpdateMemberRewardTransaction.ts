import { Context } from '../../index'
import { IUpdateMemberRewardTransaction } from './../../../../../domain'


export default class UpdateMemberRewardTransaction implements IUpdateMemberRewardTransaction
{
    private context : Context

    private _commands : { 
        sql : string,
        values: any[]
    }[] = []

    constructor(context : Context)
    {
        this.context = context
    }

    async execute()
    {
        if(this._commands.length === 0)
        {
            return null
        }

        this.context.connect()

        for(let i = 0; i < this._commands.length; i++)
        {
            await this.context.query(this._commands[i].sql, this._commands[i].values)
        }

        this.context.complete()
        return null
    }

    setMemberInstantMatches(id : number, addNumberOfMatches : number)
    {
        this._commands.push({
            sql: 'UPDATE `members` SET `instantMatchCredit` = `instantMatchCredit` + ? WHERE `memberID` = ?',
            values: [ addNumberOfMatches, id ]
        })
    }

    setMemberPremiumForDays(id: number, numberOfDays : number)
    {
        this._commands.push({
            sql: 'UPDATE members SET premium = 1, premiumStarted = NOW(), premiumExpires = (NOW() + INTERVAL ? DAY), hideAds = 1 WHERE memberID = ? AND premium = 0',
            values: [ numberOfDays, id ]
        })
    }

    setMemberSwipeAllocation(memberId : number, swipeCredit : number)
    {
        this._commands.push({
            sql: 'UPDATE swipe_allocation SET swipeCredit = swipeCredit + ? WHERE memberID = ?',
            values: [ swipeCredit, memberId ]
        })
    }
}