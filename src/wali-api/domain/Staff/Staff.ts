import { Role } from '../Role'


export default class Staff
{
    private _id? : number

    private _roles : Role[] = []

    private _name : string

    // private _firstName : string

    // private _lastName : string

    private _password? : string

    private _email : string

    // private _token? : string

    private _description? : string

    private _picture? : string

    private _state : string = 'OK'

    private _created_at : Date

    private _updated_at : Date

    private _token? : string


    constructor(
        name : string,
        email: string,
        state? : string,
        password? : string,
        description? : string,
        created_at? : string,
        updated_at? : string,
        id? : number)
    {
        this._id          = id
        this._name        = name
        this._password    = password
        this._email       = email
        this._description = description
        this._state       = state || 'OK'
        this._created_at  = created_at ? new Date(created_at) : new Date()
        this._updated_at  = updated_at ? new Date(updated_at) : new Date()
    }

    get id()
    {
        return this._id
    }

    get roles()
    {
        return this._roles
    }

    get name()
    {
        return this._name
    }

    get password()
    {
        return this._password
    }

    setPassword(password : string)
    {
        this._password = password
    }

    removePassword()
    {
        this._password = undefined
    }

    get email()
    {
        return this._email
    }

    get description()
    {
        return this._description
    }

    get picture()
    {
        return this._picture
    }

    get state()
    {
        return this._state
    }

    set state(value : string)
    {
        this._state = value
    }

    get created()
    {
        return this._created_at
    }

    get updated()
    {
        return this._updated_at
    }

    addRole(role : Role)
    {
        this._roles.push(role)
    }

    setToken(token : string)
    {
        this._token = token
    }

}
