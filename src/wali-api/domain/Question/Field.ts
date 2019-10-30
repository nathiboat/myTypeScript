export default class Field
{
    private _allowedFields : string[] = [
        'photoVerification',
        'photo1',
        'photo2',
        'photo3',
        'photo4',
        'photo5',
        'statusMessage',
        'longDescription'
    ]

    private _allowedAnswers : string[] = ['yes', 'no']

    private _answer : string

    private _field : string


    constructor(answer : string, field : string)
    {
        this.assertValidField(field)
        this.assertValidAnswer(answer)

        this._answer = answer
        this._field  = field
    }

    private assertValidField(field : string)
    {
        if(!this._allowedFields.includes(field) || field === undefined)
        {
            throw Error(`Invalid field: ${ field }`)
        }
    }

    private assertValidAnswer(answer : string)
    {
        if(!this._allowedAnswers.includes(answer) || answer === undefined)
        {
            throw Error(`Invalid answer: ${ answer }`)
        }
    }

    isApproved()
    {
        return this._answer === 'yes'
    }

    get field()
    {
        return this._field
    }

    get answer()
    {
        return this._answer
    }
}
