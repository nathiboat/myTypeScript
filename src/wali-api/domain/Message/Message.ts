
export default class Message
{
    private _messageId : string

    private _matchId : number

    private _senderMemberId : number

    private _body: string

    private _messageType : string

    private _timeStamp : Date

    private _memberId? : number

    private _memberHashId? : string

    private _sendXmpp : boolean = false

    private _sendNotification : boolean = false

    // A is for Admin messages, T is for member to member messages
    private _availableTypes = ['A', 'T']


    constructor (
        messageId : string,
        matchId : number,
        senderMemberId : number,
        body : string,
        messageType : string,
        timeStamp? : string,
    ){
        this.assertValidMessageType(messageType)

        this._messageId      = messageId
        this._matchId        = matchId
        this._senderMemberId = senderMemberId
        this._body           = body
        this._messageType    = messageType
        this._timeStamp      = timeStamp ? new Date(timeStamp) : new Date()
    }

    private assertValidMessageType(type? : string)
    {
        if(type && !this._availableTypes.includes(type))
        {
            throw Error('Message type do not match available ones')
        }
    }

    get messageId()
    {
        return this._messageId
    }

    get matchId()
    {
        return this._matchId
    }

    get messageType()
    {
        return this._messageType
    }

    get senderMemberId()
    {
        return this._senderMemberId
    }

    get body()
    {
        return this._body
    }

    get timeStamp()
    {
        return this._timeStamp.toISOString()
    }

    get memberId() {
        return this._memberId
    }

    get memberHashId()
    {
        return this._memberHashId
    }

    setMemberHashId(hashId : string)
    {
        this._memberHashId = hashId
    }

    setMemberId(id : number)
    {
        this._memberId = id
    }

    setSendXMPP(value : boolean)
    {
        this._sendXmpp = value
    }

    setSendNotification(value : boolean)
    {
        this._sendNotification = value
    }

    shouldSendPushNotification ()
    {
        return this._sendNotification
    }

    shouldSendXMPP ()
    {
        return this._sendXmpp
    }
}
