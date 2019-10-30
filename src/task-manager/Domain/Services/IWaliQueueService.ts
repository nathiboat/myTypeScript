export default interface IWaliQueueService
{
    setKey(key : string) : void

    push(ids : number[]) : Promise<void>

    getContent() : Promise<number[]>

    getFirst(ids? : number[]) : Promise<number | null>

    clear() : Promise<boolean>
    
    remove(id : number) : Promise<boolean>
}