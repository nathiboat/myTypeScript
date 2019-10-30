import { ICache, IWaliApproveLock, QueueMember } from './../../application'


export default class WaliApproveLock implements IWaliApproveLock
{
    private _cache : ICache

    private _key : string

    private _queue : QueueMember[] = []


    constructor(key : string, cache : ICache)
    {
        this._key   = key
        this._cache = cache
    }

    private async initialize()
    {
        // Connect to Redis instance
        this._cache.connect()

        // 1. Check if the key exists in the cache
        let keyExists = await this.checkIfKeyExists()

        // 2. If key doesn't exist then set it up with empty queue from this object
        if(!keyExists)
        {
            await this.set()
            return
        }

        // 3. Get the cache for this key
        let result = await this._cache.get(this._key)
        if(result !== null)
        {
            // 4. Set the old value from key in queue
            let valid = this.prune(<string>result)
            this._queue = valid
        }
    }

    async push(member : QueueMember)
    {
        // 1. Init the object state
        await this.initialize()

        // 2. Check if member already exists in the queue
        let found = this.exists(member)
        if(found !== false)
        {
            // 3A. If index found, update the member at index with new value
            this.update(<number>found, member)
        } else {
            // 3B. If not found, set new member into queue
            this._queue.push(member)
        }

        // 4. Save new value for key
        await this.set()

        // 5. Close connection
        this._cache.close()
    }

    async get()
    {
        // 1. Init the object state
        await this.initialize()

        // 2. Close connection
        this._cache.close()

         // 3. Return the queue
        return this._queue
    }

    async removeMember(memberId : number) : Promise<void>
    {
        try {
            // 1. Init the object state
            await this.initialize()

            // 2. Remove member from queue
            this._queue = this._queue.filter((member)=> {
                return member.memberId !== memberId
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
        let result = await this._cache.set(this._key, this.stringify())
        if(result === false)
        {
            throw Error('Key value pair was not set')
        }
    }

    private stringify()
    {
        return JSON.stringify(this._queue)
    }

    private parse(payload : string)
    {
        return JSON.parse(payload)
    }

    private prune(payload : string)
    {
        let results = JSON.parse(payload)
        return results.filter((result : QueueMember)=> {
            let now = new Date()
            let ttl = new Date(result.ttl)
            return now.getTime() < ttl.getTime()
        })
    }

    private exists(member : QueueMember) : boolean | number
    {
        let found : boolean | number = false
        this._queue.forEach((queueMember, index)=> {
            if(queueMember.memberId === member.memberId)
            {
                found = index
            }
        })
        return found
    }

    private update(index : number, member : QueueMember)
    {
        this._queue[index].staffId = member.staffId
        this._queue[index].ttl     = member.ttl
    }

    private async checkIfKeyExists() : Promise<boolean>
    {
        return await this._cache.exists(this._key)
    }

    addExpireIn(minute? : number)
    {
        if(minute === undefined)
        {
            minute = 5
        }
        let date = new Date()
        return new Date(date.getTime() + minute * 60000).toString()
    }
}
