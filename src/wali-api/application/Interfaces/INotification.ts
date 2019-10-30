import { Message, Member } from './../../domain'

interface INotification {
    send(messages : Message[], member : Member, senderProfile : { [key : string] : any }, debug? : boolean) : void
}

export default INotification