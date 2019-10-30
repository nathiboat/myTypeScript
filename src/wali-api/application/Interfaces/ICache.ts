interface ICache
{
    // Key
    exists(key : string) : Promise<boolean>

    remove(key : string) : Promise<boolean>

    expireIn(key : string, seconds : number) : Promise<boolean>

    rename(key : string, newKey : string) : Promise<any>


    // String
    set(key : string, value : string) : Promise<boolean>

    get(key : string) : Promise<string | number | null>


    // Set

    getSet(key : string, returnScores? : boolean) : Promise<any>

    addToSet(key : string, memberId : string) : Promise<any>

    removeFromSet(key : string, memberId : string) : Promise<any>

    getHash(key : string) : Promise<{[propName : string] : string} | null>


    // List
    getAllKeys() : Promise<string[]>

    push(key : string, value : string[]) : Promise<number>

    listLength(key : string) : Promise<number>

    getListContent(key : string) : Promise<string[]>

    replaceAtPosition(key : string, index : number, newValue : string | number) : Promise<any>

    removeFromList(key : string, index : number, value : string) : Promise<boolean>
    
    
    // Transaction

    transaction() : Promise<any>

    execute() : Promise<any>

    discard() : Promise<any>

    type(key : string) : Promise<string>
    

    // Redis instance and connection

    connect() : void

    close() : void
}

export default ICache
