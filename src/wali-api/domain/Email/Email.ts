export default class Email
{
    private _toEmail : string

    private _from : string

    private _subject : string

    private _body : string


    constructor(toEmail : string, from : string, subject : string, body : string)
    {
        this._toEmail = toEmail
        this._from    = from 
        this._subject = subject
        this._body    = body
    }

    get toEmail()
    {
        return this._toEmail
    }

    get from()
    {
        return this._from
    }

    get subject()
    {
        return this._subject
    }

    get body()
    {
        return this._body
    }
}