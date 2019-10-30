
export default interface IDetachStaffRoleCommand
{
    execute(staffId? : number, roleId? : number) : Promise<null>
}
