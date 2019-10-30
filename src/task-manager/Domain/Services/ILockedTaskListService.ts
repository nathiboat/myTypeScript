import VirtualQueue from '../VirtualQueue'


export default interface ILockedTaskListService 
{
    setKey(key : string) : void

    add(item : VirtualQueue) : Promise<void>

    get() : Promise<VirtualQueue[]>

    removeItem(itemId : number) : Promise<void>

    clear() : Promise<void>
}