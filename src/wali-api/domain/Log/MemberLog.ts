export default class MemberLog
{

    private _id? : number

    private _memberId : number

    private _udid? : string

    private _idfa? : string

    private _eventCode : string

    private _action : string

    private _timeStamp : Date

    private _gpsLatitude? : string

    private _gpsLongitude? : string

    private _appVersion? : string

    private _mobileOsVersion? : string

    private _mobileOs? : string

    private _serverRemoteAddress? : string


    constructor (
        memberId : number,
        eventCode : string,
        action : string,
        timeStamp? : string,
        udid? : string,
        idfa? : string,
        gpsLatitude? : string,
        gpsLongitude? : string,
        appVersion? : string,
        mobileOsVersion? : string,
        mobileOs? : string,
        serverRemoteAddress? : string,
        id? : number
    ){

            this._memberId            = memberId
            this._udid                = udid
            this._idfa                = idfa
            this._eventCode           = eventCode
            this._action              = action
            this._timeStamp           = timeStamp ? new Date(timeStamp) : new Date()
            this._gpsLatitude         = gpsLatitude
            this._gpsLongitude        = gpsLongitude
            this._appVersion          = appVersion
            this._mobileOsVersion     = mobileOsVersion
            this._mobileOs            = mobileOs
            this._serverRemoteAddress = serverRemoteAddress
            this._id                  = id
    }

    get memberId()
    {
        return this._memberId
    }

    get udid()
    {
        return this._udid
    }

    get idfa()
    {
        return this._idfa
    }

    get eventCode()
    {
        return this._eventCode
    }

    get action()
    {
        return this._action
    }

    get timeStamp()
    {
        return this._timeStamp
    }

    get gpsLatitude()
    {
        return this._gpsLatitude
    }

    get gpsLongitude()
    {
        return this._gpsLongitude
    }

    get appVersion()
    {
        return this._appVersion
    }

    get mobileOsVersion()
    {
        return this._mobileOsVersion
    }

    get mobileOs()
    {
        return this._mobileOs
    }

    get serverRemoteAddress()
    {
        return this._serverRemoteAddress
    }

    get id()
    {
        return this._id
    }
}
