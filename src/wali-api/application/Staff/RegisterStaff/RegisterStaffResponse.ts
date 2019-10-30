import BaseResponse from './../../BaseResponse'
import { Staff, Role } from './../../../domain'


export default class RegisterStaffResponse extends BaseResponse
{
    body(staff : Staff)
    {
        let result = this.removeUnderscore(staff)
        result.roles = result.roles.map((role : Role)=> {
            return this.removeUnderscore(role)
        })
        return result
    }
}
