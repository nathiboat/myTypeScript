import jwt from 'jsonwebtoken'
import { ICheckTokenService } from './../../application'


export default class CheckTokenService implements ICheckTokenService
{
    private _jwtSecret : string

    constructor(jwtSecret : string)
    {
        this._jwtSecret = jwtSecret
    }

    execute(token : string)
    {
        if(!this._jwtSecret) { throw Error('JWT SECRET was not set') }
        return jwt.verify(token, this._jwtSecret)
    }
}
