export default class Image
{
    private _path : string

    private _isVerification? : boolean

    private _type : string

    constructor(path : string, type: string, isVerification? : boolean)
    {
        this._path = path
        this._isVerification = isVerification || false
        this.assertValidType(type)
        this._type = type
    }

    get name()
    {
        return this._path
    }

    get isVerification()
    {
        return this._isVerification
    }

    get type() {
        return this._type
    }

    assertValidType(type : string) {
        
        let validTypes : string[] = [
            'photo1',
            'photo2',
            'photo3',
            'photo4',
            'photo5',
            'photoVerification']

        if(validTypes.includes(type)) {
            if (this._isVerification === true && type !== 'photoVerification')
                throw Error('Type can only be photoVerification when isVerification is set to true')
            else
            return true
        } else {
            throw Error('Invalid image type')
        }
    }
}
