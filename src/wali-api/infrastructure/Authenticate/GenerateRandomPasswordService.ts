import generator from 'generate-password'
import { IGenerateRandomPassword } from './../../application/Interfaces'


export default class GenerateRandomPasswordService implements IGenerateRandomPassword
{
    private _length : number

    private _numbers : boolean

    private _uppercase : boolean


    constructor(length : number, numbers? : boolean, uppercase? : boolean)
    {
        this._length    = length
        this._numbers   = numbers ? numbers : true
        this._uppercase = uppercase ? uppercase : true
    }

    execute()
    {
        let result = generator.generate({
            length: this._length,
            uppercase: this._uppercase,
            numbers: this._numbers,
            exclude: 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
        })
        return result
    }
}
