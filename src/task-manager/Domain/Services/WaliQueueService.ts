import ICache from '../Shared/ICache'
import IWaliQueueService from './IWaliQueueService'


export default class WaliQueueService implements IWaliQueueService
{
    private _key? : string 



    constructor(private _cache : ICache, private _expireInSeconds? : number)
    {
        //
    }

    setKey(key : string)
    {
        this._key = key
    }

    async push(ids : number[])
    {        
        if(!this._key)
        {
            throw Error('Key was not found')
        }

        for(let id of ids)
        {
            await this._cache.pushInList(this._key, id.toString())
        }
        await this._cache.expireKey(this._key, this._expireInSeconds || 60 * 5)
        this._cache.close()
    }

    async getContent()
    {
        if(!this._key)
        {
            throw Error('Key was not found')
        }

        let content = await this._cache.getElementsInList(this._key)
        this._cache.close()
        return content.map(id => parseInt(id))
    }

    async getFirst(ids? : number[]) : Promise<number | null>
    {
        if(!this._key)
        {
            throw Error('Key was not found')
        }

        let content = await this._cache.getElementsInList(this._key)
        let result = content.map(id => parseInt(id))

        this._cache.close()

        // If there are any ids left
        if(result.length > 0)
        {
            // if the excluded ids are set (the locked ones)
            if(ids)
            {
                // Get the first id in the queue excluding the locked ones
                let nonLockedIds = result.filter((id)=> !ids.includes(id) )
                if(nonLockedIds.length > 0)
                {
                    return nonLockedIds[0]
                } 
                return null
            }
            return result[0]
        }

        // If there is no id left
        return null
    }

    async clear() : Promise<boolean>
    {
        if(!this._key)
        {
            throw Error('Key was not found')
        }
        let result = await this._cache.deleteKey(this._key)
        this._cache.close()
        return result
    }

    async remove(id : number)
    {
        if(!this._key)
        {
            throw Error('Key was not found')
        }

        let result = await this._cache.removeFromList(this._key, 0, id.toString())
        this._cache.close()
        return result
    }
}