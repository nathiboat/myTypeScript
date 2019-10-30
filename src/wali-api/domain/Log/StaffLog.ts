export default class StaffLog
{

    private _id? : number

    private _staffId : number

    private _eventCode : string

    private _timeStamp : Date

    private _memberId? : number

    private _action? : string

    private _ipAddress? : string

    private _ipCountryCode? : string


    constructor(
        staffId : number,
        eventCode : string,
        timeStamp? : string,
        memberId? : number,
        action? : string,
        ipAddress? : string,
        ipCountryCode? : string,
        id? : number
    ) {

        this._staffId       = staffId
        this._eventCode     = eventCode
        this._timeStamp     = timeStamp ? new Date(timeStamp) : new Date()
        this._memberId      = memberId
        this._action        = action
        this._ipAddress     = ipAddress
        this._ipCountryCode = ipCountryCode
        this._id            = id
    }

    get staffId()
    {
        return this._staffId
    }

    get eventCode()
    {
        return this._eventCode
    }

    get timeStamp()
    {
        return this._timeStamp
    }

    get memberId()
    {
        return this._memberId
    }

    get action()
    {
        return this._action
    }

    get ipAddress()
    {
        return this._ipAddress
    }

    get ipCountryCode()
    {
        return this._ipCountryCode
    }

    get id()
    {
        return this._id
    }

    setMemberId(value : number)
    {
        this._memberId = value
    }

    setAction(value : string)
    {
        this._action = value
    }

    setIpAddress(value : string)
    {
        this._ipAddress = value
    }

    setCountryCode(value : string)
    {
        this._ipCountryCode = value
    }
}
