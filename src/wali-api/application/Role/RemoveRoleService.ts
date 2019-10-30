import { IDeleteRoleCommand } from './../../domain'



export default class RemoveRoleService
{
    private _deleteRoleCommand  : IDeleteRoleCommand

    constructor(deleteRoleCommand : IDeleteRoleCommand)
    {
        this._deleteRoleCommand = deleteRoleCommand
    }

    async execute(roleId : number) {
        try {
            return await this._deleteRoleCommand.execute(roleId)
        } catch(error) {
            throw Error(error.message)
        }
    }
}
