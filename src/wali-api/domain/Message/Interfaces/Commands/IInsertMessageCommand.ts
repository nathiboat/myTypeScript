import Message from '../../Message'

export default interface IInsertMessageCommand {

    execute(message: Message) : Promise<null>

}