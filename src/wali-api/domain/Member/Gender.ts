export default class Gender
{
    private _value : string

    private _validGenders = ['M', 'F', 'X']

    constructor(value : string)
    {
        this.assertValidGender(value)
        this._value = value
    }

    private assertValidGender(value : string)
    {
        if(!this._validGenders.includes(value))
        {
            throw Error('Invalid Gender supplied')
        }
    }

    get value()
    {
        return this._value
    }

    isMale()
    {
        return this.value === 'M'
    }

    isFemale()
    {
        return this.value === 'F'
    }
}