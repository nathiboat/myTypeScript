import bcrypt from 'bcryptjs'
import { ICheckPasswordHashService } from "../../application/Interfaces"


export default class CheckPasswordHashService implements ICheckPasswordHashService
{
    execute(plainPassword : string, hash : string) : boolean
    {
        return bcrypt.compareSync(plainPassword, hash)
    }
}
