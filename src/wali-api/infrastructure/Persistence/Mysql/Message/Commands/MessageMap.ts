import { Message } from "../../../../../domain"

export default class MessageMap
{
    static deconstruct(message : Message) : { [key : string] : any }
    {
        return {
            messageId: message.messageId,
            matchID_fk: message.matchId,
            senderMemberID: message.senderMemberId,
            messageType: message.messageType,
            body: message.body,
            timeStamp: message.timeStamp,
        }
    }
}