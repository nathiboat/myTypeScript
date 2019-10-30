
export default interface IWaliApproveList
{
    push(ids : number[]) : Promise<void>

    content() : Promise<number[]>

    remove(id : number) : Promise<boolean>
}