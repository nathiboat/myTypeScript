import { Context } from './../../'
import MemberResult from './MemberResult'
import { ISelectMemberByHashIdQuery } from './../../../../../domain'


/*
    Get a Member by hash id
*/

export default class SelectMemberByHashIdQuery implements ISelectMemberByHashIdQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute(hashMemberId : string)
    {
        this.context.connect()

        let rows =  await this.context.query(
            `SELECT *
             FROM members
             WHERE hashMemberID = ?`, [ hashMemberId ])
    
        this.context.complete()
        return new MemberResult(rows).retrieve()[0]
    }
}
