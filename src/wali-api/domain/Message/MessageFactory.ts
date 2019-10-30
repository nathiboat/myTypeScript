import Message from './Message'
import { GenerateUuidTokenService } from './../../infrastructure/Authenticate' 


type MessageOptions = {
    messageId? : string,
    matchId : number,
    senderMemberId : number,
    memberId? : number,
    memberHashId? : string,
    body : string,
    messageType : string,
    timeStamp? : string,
    sendXmpp? : boolean,
    sendPush? : boolean
}


export default class MessageFactory {

    static build(options : MessageOptions) {
        let message = new Message(
            options.messageId || GenerateUuidTokenService.execute(),
            options.matchId,
            options.senderMemberId,
            options.body,
            options.messageType,
            options.timeStamp
        )

        if(options.memberHashId)
        {
            message.setMemberHashId(options.memberHashId)
        }

        if(options.sendXmpp)
        {
            message.setSendXMPP(options.sendXmpp)
        }

        if(options.sendPush)
        {
            message.setSendNotification(options.sendPush)
        }

        if(options.memberId)
        {
            message.setMemberId(options.memberId)
        }

        return message
    }
}