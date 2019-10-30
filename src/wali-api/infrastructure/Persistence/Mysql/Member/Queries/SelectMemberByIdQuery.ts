import { Context } from './../../'
import MemberResult from './MemberResult'
import { ISelectMemberByIdQuery } from './../../../../../domain'


/*
    Get a Member by ID
*/

export default class SelectMemberByIdQuery implements ISelectMemberByIdQuery
{
    private context : Context


    constructor(context : Context)
    {
        this.context = context
    }

    async execute(id : number)
    {
        this.context.connect()

        let rows =  await this.context.query(

            `SELECT *
             FROM members
             WHERE members.memberID = ?`, [id])

        this.context.complete()
        return new MemberResult(rows).retrieve()
    }
}
