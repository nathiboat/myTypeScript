import { Context } from '../../index'
import { IUpdateMemberInstantMatchCreditCommand } from './../../../../../domain'

export default class UpdateMemberInstantMatchCreditCommand implements IUpdateMemberInstantMatchCreditCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(id : number, addNumberOfMatches : number)
    {
        this.context.connect()

        await this.context.query(
            'UPDATE `members` SET `instantMatchCredit` = `instantMatchCredit` + ? WHERE `memberID` = ?',
             [addNumberOfMatches, id])
        this.context.complete()
        return null
    }
}