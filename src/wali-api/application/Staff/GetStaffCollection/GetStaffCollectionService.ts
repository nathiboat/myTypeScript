import { ISelectAllStaffQuery } from './../../../domain'
import BaseResponse from './../../BaseResponse'


export default class GetStaffCollectionService
{
    private _selectAllStaff : ISelectAllStaffQuery

    private _response : BaseResponse

    constructor(
        selectAllStaff : ISelectAllStaffQuery,
        response : BaseResponse
    ){
        this._selectAllStaff = selectAllStaff
        this._response       = response
    }

    async execute()
    {
        try {
            let staffs = await this._selectAllStaff.execute()
            return this._response.body(staffs)
        } catch(error) {
            throw error
        }
    }
}
