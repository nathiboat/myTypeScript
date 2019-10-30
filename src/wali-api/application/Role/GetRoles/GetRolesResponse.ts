import BaseResponse from './../../BaseResponse'
import { Role } from './../../../domain'


export default class GetRolesResponse extends BaseResponse
{
    body(roles : Role[])
    {
        return roles.map((role)=> {
            return this.removeUnderscore(role)
        })
    }
}
