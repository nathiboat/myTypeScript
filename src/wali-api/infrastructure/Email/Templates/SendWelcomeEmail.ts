export default class SendWelcomeEmail
{
    private _subject : string

    private _content : string


    constructor(name : string)
    {
        this._subject = 'Welcome to Wali'

        this._content = `
            Hey ${ name },
            
            You have become one of our team.
          
            Use your email to generate password.

            Muzmatch team
        `
    }

    get subject()
    {
        return this._subject
    }

    get content()
    {
        return this._content
    }
}
