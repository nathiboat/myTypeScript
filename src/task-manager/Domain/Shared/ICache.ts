export default interface ICache
{
    // Connection methods
    connect() : void

    close() : void

    // Key methods
    deleteKey(key : string) : Promise<boolean>

    existKey(key : string) : Promise<boolean>

    expireKey(key : string, seconds : number) : Promise<boolean>

    getAllKeys() : Promise<string[]>

    // String methods
    setString(key : string, value : string) : Promise<any>

    getString(key : string) : Promise<string | number | null>

    // Lock
    setNX(key : string, value : string) : Promise<any>

    getTTL(key : string) : Promise<any>

    // List methods
    pushInList(key : string, value : string) : Promise<boolean>

    getElementsInList(key : string) : Promise<string[]>

    removeFromList(key : string, index : number, value : string) : Promise<boolean>
}