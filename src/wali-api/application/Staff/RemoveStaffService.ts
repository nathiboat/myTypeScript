import { IDeleteStaffCommand, ISelectOneStaffByQuery } from './../../domain'
import { StaffNotFoundException } from './../Exceptions'



export default class RemoveStaffService
{
    private _selectStaff : ISelectOneStaffByQuery

    private _deleteStaff : IDeleteStaffCommand

    constructor(
        selectStaff : ISelectOneStaffByQuery,
        removeStaff : IDeleteStaffCommand
    ){
        this._selectStaff = selectStaff
        this._deleteStaff = removeStaff
    }

    async execute(id : number)
    {
        // 1. Get staff with id
        let staff = await this._selectStaff.execute({ id: id })
        if(!staff)
        {
            throw new StaffNotFoundException('RemoveStaffService')
        }

        await this._deleteStaff.execute(staff)

        return null
    }
}
