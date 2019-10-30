export default class StaffSession
{
    private _staffId : number

    private _ipAddress : string

    private _ipCountryCode : string

    private _userAgent : string

    private _passwordToken? : string

    private _lastActive : Date

    private _created : Date

    private _updated : Date

    private _state : string

    private _id? : number


    constructor(
        staffId : number, 
        ipAddress : string, 
        ipCountryCode : string, 
        userAgent : string, 
        passwordToken? : string, 
        lastActive? : string, 
        created? : string, 
        updated? : string, 
        state? : string,
        id? : number
    ){
        this._staffId       = staffId
        this._passwordToken = passwordToken
        this._ipAddress     = ipAddress
        this._ipCountryCode = ipCountryCode
        this._userAgent     = userAgent
        this._lastActive    = lastActive ? new Date(lastActive) : new Date()
        this._created       = created ? new Date(created) : new Date()
        this._updated       = updated ? new Date(updated) : new Date()
        this._state         = state || 'LOGIN'
        this._id            = id
    }

    get staffId()
    {
        return this._staffId
    }

    get passwordToken()
    {
        return this._passwordToken
    }

    get ipAddress()
    {
        return this._ipAddress
    }

    get ipCountryCode()
    {
        return this._ipCountryCode
    }

    get userAgent()
    {
        return this._userAgent
    }

    get lastActive()
    {
        return this._lastActive
    }

    get created()
    {
        return this._created
    }

    get updated()
    {
        return this._updated
    }

    get state()
    {
        return this._state
    }

    get id()
    {
        return this._id
    }

    setState(value : string)
    {
        this._state = value
    }

    setToken(value : string)
    {
        this._passwordToken = value
    }
}