
import { Context } from '../../index'
import { IUpdateLastMessageBodyCommand } from '../../../../../domain'

export default class UpdateLastMessageBodyCommand implements IUpdateLastMessageBodyCommand {

    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(lastMessageBody : string, lastSenderId : number, matchId : number)
    {
        this.context.connect()

        await this.context.query(
            `UPDATE matches SET lastMessageBody = ?, lastSenderID = ? , newMatch = IF(? != 1, 0, newMatch), threadLastUpdated = ? where id = ?`,
            [lastMessageBody, lastSenderId, lastSenderId, new Date().toISOString(), matchId])
        this.context.complete()
        return null
    }
}