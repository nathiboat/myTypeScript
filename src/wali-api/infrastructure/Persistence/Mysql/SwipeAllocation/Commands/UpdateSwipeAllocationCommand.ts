import { Context } from '../../index'
import { IUpdateSwipeAllocationCommand } from './../../../../../domain'

export default class UpdateSwipeAllocationCommand implements IUpdateSwipeAllocationCommand {

    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(memberId : number, swipeCredit : number)
    {
        this.context.connect()
        await this.context.query(
            `UPDATE swipe_allocation
             SET swipeCredit = swipeCredit + ?
             WHERE memberID = ?`, [ swipeCredit, memberId ])

        this.context.complete()
        return null
    }
}