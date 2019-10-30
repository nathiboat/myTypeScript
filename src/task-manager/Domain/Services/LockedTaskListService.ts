import ICache from '../Shared/ICache'
import VirtualQueue from '../VirtualQueue'
import ILockedTaskListService from './ILockedTaskListService'


export default class LockedTaskListService implements ILockedTaskListService
{
    private _key? : string

    private _queue : VirtualQueue[] = []


    constructor(private _cache : ICache, private _expireInSeconds : number)
    {
        //
    }

    private async initialize()
    {
        if(!this._key)
        {
            throw Error('Key is not set')
        }
        // 1. Get the cache for this key and set it as this object state
        let result = await this._cache.getString(this._key)
        if(result !== null)
        {
            // 4. Set the old value from key in queue
            let valid = this.prune(<string>result)
            this._queue = valid
        }
    }

    setKey(key : string)
    {
        this._key = key
    }

    async add(item : VirtualQueue)
    {
        // 1. Init the object state
        await this.initialize()
        
        // Set the item ttl from expireIn field
        if(!item.ttl)
        {
            item.ttl = this.addExpireIn(item.expireInSeconds || this._expireInSeconds)
        }

        // 2. Check if member already exists in the queue
        let found = this.exists(item)
        if(found !== false)
        {
            // 3A. If index found, update the member at index with new value
            this.update(<number>found, item)
        } else {
            // 3B. If not found, set new member into queue
            this._queue.push(item)
        }

        // 4. Save new value for key
        await this.set()

        // 5. Close connection
        this._cache.close()
    }

    async get() : Promise<VirtualQueue[]>
    {
        // 1. Init the object state
        await this.initialize()

        // 2. Close connection
        this._cache.close()

         // 3. Return the queue
        return this._queue
    }

    async removeItem(itemId : number) : Promise<void>
    {
        try {
            // 1. Init the object state
            await this.initialize()

            // 2. Remove member from queue
            this._queue = this._queue.filter((item)=> {
                return item.itemId !== itemId
            })

            // 3. Save the new state of the cache key
            await this.set()

            // 4. Close connection
            this._cache.close()
        } catch(error) {
            throw error
        }
    }

    private async set()
    {
        if(!this._key)
        {
            throw Error('Key is not set')
        }
        let result = await this._cache.setString(this._key, JSON.stringify(this._queue))
        if(result === false)
        {
            throw Error('Key value pair was not set')
        }
    }

    private prune(payload : string)
    {
        let results = JSON.parse(payload)
        return results.filter((result : VirtualQueue)=> {
            let now = new Date()
            let ttl = new Date(result.ttl!) // TTL is 100% set at this point
            return now.getTime() < ttl.getTime()
        })
    }

    private exists(item : VirtualQueue) : boolean | number
    {
        let found : boolean | number = false
        this._queue.forEach((queueItem, index)=> {
            if(queueItem.itemId === item.itemId)
            {
                found = index
            }
        })
        return found
    }

    // If item is already found in the queue, just update the ttl
    private update(index : number, item : VirtualQueue)
    {
        this._queue[index].ttl = item.ttl
    }

    private addExpireIn(seconds : number)
    {
        let date = new Date()
        return new Date(date.getTime() + seconds * 1000).toString()
    }

    async clear()
    {
        this._queue = []
        await this.set()
        this._cache.close()
    }
}
