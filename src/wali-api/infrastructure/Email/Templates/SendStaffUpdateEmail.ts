export default class SendStaffUpdateEmail
{
    private _subject : string

    private _content : string


    constructor(name : string)
    {
        this._subject = 'Your Wali profile has been updated'

        this._content = `
            Hey ${ name },

            Your profile has been updated by an admin.

            Use your email to generate password, login and view the changes.

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
