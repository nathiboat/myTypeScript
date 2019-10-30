import jwt from 'jsonwebtoken'
import { IGenerateToken } from './../../application/Interfaces'


export default class GenerateTokenService implements IGenerateToken
{
    private _secret : string

    private _expire : number

    constructor(secret : string, expire : number)
    {
        this._secret = secret
        this._expire = expire
    }

    execute(firstName : string, id : number)
    {
        return jwt.sign({
            data: {
                id,
                firstName
            }
        }, this._secret, { expiresIn: this._expire })
    }
}
