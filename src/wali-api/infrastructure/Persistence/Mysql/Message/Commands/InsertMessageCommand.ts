
import { Context } from '../../index'
import { Message, IInsertMessageCommand } from './../../../../../domain'
import MessageMap from './MessageMap'


export default class InsertMessageCommand implements IInsertMessageCommand{

    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(message: Message)
    {
        this.context.connect()
        
        let columns = Object.keys(MessageMap.deconstruct(message)).join(',')
        let values = Object.values(MessageMap.deconstruct(message))

        let result = await this.context.query(
            `INSERT INTO messages (${ columns }) VALUES (?, ?, ? ,? ,?, ?) ON DUPLICATE KEY UPDATE body = ?, timeStamp = ? `, [...values, message.body, message.timeStamp])
        this.context.complete()
        return null
    }
}