import {
    RoleFactory,
    IInsertRoleCommand,
    ISelectRoleByNameAndProductQuery
} from './../../../domain'
import BaseResponse from './../../BaseResponse'
import { RoleNotFoundException } from './../../Exceptions'


export default class CreateRoleService
{

    private _insertRoleCommand : IInsertRoleCommand

    private _selectRoleQuery : ISelectRoleByNameAndProductQuery

    private _response : BaseResponse

    constructor(
        insertRoleCommand: IInsertRoleCommand,
        selectRoleQuery : ISelectRoleByNameAndProductQuery,
        response : BaseResponse)
    {
        this._insertRoleCommand = insertRoleCommand
        this._selectRoleQuery   = selectRoleQuery
        this._response          = response
    }

    async execute(roleName : string, productName : string, roleDescription? : string)
    {
        try {
            // 1. Create a new Role
            let role = RoleFactory.build({
                roleName: roleName,
                productName: productName,
                roleDescription: roleDescription
            })

            // 2. Insert Role into database
            await this._insertRoleCommand.execute(role)

            // 3. Get back the inserted Role
            let foundRole = await this._selectRoleQuery.execute(roleName, productName)

            if(!foundRole)
            {
                throw new RoleNotFoundException('CreateRoleService')
            }
            return this._response.body(foundRole)

        } catch(error) {
            throw error
        }
    }
}
