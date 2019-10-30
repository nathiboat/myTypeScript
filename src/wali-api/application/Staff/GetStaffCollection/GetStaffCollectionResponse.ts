import BaseResponse from './../../BaseResponse'
import { Staff, Role } from './../../../domain'


export default class GetStaffCollectionResponse extends BaseResponse
{
    body(staffs : Staff[])
    {
        return staffs.map((staff)=> {
            let result = this.removeUnderscore(staff)
            result.roles = result.roles.map((role : Role)=> {
                return this.removeUnderscore(role)
            })
            return result
        })
    }
}
