export default class Question
{
    private _field : string

    private _question : string

    private _value? : string

    private _comparison? : string

    private _type? : string

    constructor(field: string, question: string, value : string, type : string, comparison? : string)
    {
        this._field      = field
        this._question   = question
        this._value      = value
        this._type       = type
        this._comparison = comparison
    }

    get field()
    {
        return this._field
    }

}
