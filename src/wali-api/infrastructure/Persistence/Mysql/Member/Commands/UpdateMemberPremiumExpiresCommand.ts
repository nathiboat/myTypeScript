import { Context } from '../../index'
import { IUpdateMemberPremiumExpireCommand } from './../../../../../domain'

export default class UpdateMemberPremiumExpireCommand implements IUpdateMemberPremiumExpireCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(id: number, numberOfDays : number)
    {
        this.context.connect()

        await this.context.query(
            `UPDATE members SET premium = 1, premiumStarted = NOW(), premiumExpires = (NOW() + INTERVAL ? DAY), 
            hideAds = 1 WHERE memberID = ? AND premium = 0`,
             [numberOfDays, id])
        this.context.complete()
        return null
    }
}