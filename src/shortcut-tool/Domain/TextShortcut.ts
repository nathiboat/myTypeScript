export default class TextShortcut
{
    id? : number
    name : string
    keys : string
    content : string
    deleted : boolean
    private _timeStamp : Date

    constructor(name : string, keys : string, content : string, deleted : boolean, id? : number, timeStamp? : string)
    {
        this.id = id
        this.name = name
        this.keys = keys
        this.content = content
        this.deleted = deleted
        this._timeStamp = timeStamp ? new Date(timeStamp) : new Date()
    }
    
    get timeStamp() {
        return this._timeStamp
    }
}