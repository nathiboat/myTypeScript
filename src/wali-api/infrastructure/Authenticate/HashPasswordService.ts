import bcrypt from 'bcryptjs'
import { IHashPasswordService } from "../../application/Interfaces"


export default class HashPasswordService implements IHashPasswordService
{
    private _rounds? : string


    constructor(rounds? : string)
    {
        this._rounds = rounds
    }

    execute(password: string) : string
    {
        return bcrypt.hashSync(password, this._rounds)
    }
}
