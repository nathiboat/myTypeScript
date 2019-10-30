export default interface IWaliQueueLockService
{
    setKey(key : string) : void

    lock(callback : Function) : Promise<any>

    unlock() : Promise<boolean>
    
}