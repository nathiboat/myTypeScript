import { ISelectAllRolesQuery } from './../../../domain'
import BaseResponse from './../../BaseResponse'


export default class GetRolesService
{

    private _selectRolesQuery  : ISelectAllRolesQuery;

    private _response : BaseResponse


    constructor(
        selectRolesQuery : ISelectAllRolesQuery,
        response : BaseResponse
    ){
        this._selectRolesQuery = selectRolesQuery
        this._response = response
    }

    async execute()
    {
        try {
            let roles = await this._selectRolesQuery.execute()
            return this._response.body(roles)
        } catch(error) {
            throw error
        }
    }
}
