import { Context } from './../../'
import MemberResult from './MemberResult'
import { ISelectMemberByIdfaAndNotBlockedQuery } from './../../../../../domain'

/*
    Get a Member by ID
*/

export default class SelectMemberByIdfaAndNotBlockedQuery implements ISelectMemberByIdfaAndNotBlockedQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute(idfa : string)
    {
        this.context.connect()

        let rows =  await this.context.query(
            `SELECT *
             FROM members
             WHERE members.IDFA = ? AND permanentlyBlocked = 0`, [idfa])

        this.context.complete()
        return new MemberResult(rows).retrieve()
    }
}
