export default class TaskType
{
    private _type : string

    constructor(type : string)
    {
        this.assertValidType(type)
        this._type = type
    }

    private assertValidType(type : string)
    {
        if(![
            'approve', 
            'inappropriate-profile-report', 
            'inappropriate-messages-report',
            'spam-or-scam-report',
            'other-report',
            'issue'].includes(type))
        {
            throw Error(`Task type ${ type } is not valid`)
        }
    }

    get value()
    {
        return this._type
    }
}