import BaseResponse from './../../BaseResponse'
import { Role } from './../../../domain'


export default class CreateRoleResponse extends BaseResponse
{
    body(role : Role)
    {
        return this.removeUnderscore(role)
    }
}
