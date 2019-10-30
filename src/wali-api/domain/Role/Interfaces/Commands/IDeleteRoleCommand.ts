
export default interface IDeleteRoleCommand
{
    execute(id: number) : Promise<null>
}
