export default class Complete
{
    private _level : number


    constructor(level : number)
    {
        this.assertValidLevelInterval(level)
        this._level = level
    }

    private assertValidLevelInterval(level : number)
    {
        if(level > 2)
        {
            throw Error('Member complete level interval is out of range. Max 2')
        }
    }

    get level()
    {
        return this._level
    }
}
