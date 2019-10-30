import { Tedis, TedisPool } from 'tedis'
import { ICache } from './../../../application'


export default class RedisCache implements ICache
{
    private _tedis? : Tedis

    private _host : string

    private _port : number
    

    private _keyPrefix : string

    constructor(host : string, port : number, keyPrefix : string)
    {
        this._host = host
        this._port = port
        this._keyPrefix = keyPrefix
    }

    connect()
    {
        this._tedis = new Tedis({
            port: this._port,
            host: this._host
        })
    }

    async exists(key : string) : Promise<boolean>
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            // throw Error('Connection is undefined')
            this.connect()
        }
        return await this._tedis!.exists(keyWithPrefix) === 1 ? true : false
    }

    async set(key : string, value : string) : Promise<boolean>
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.set(keyWithPrefix, value) === 'OK' ? true : false
    }

    // Get strings
    async get(key : string)
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.get(keyWithPrefix)
    }

    // Get hash values
    async getHash(key : string) {

        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis) {
            this.connect()
        }
        return await this._tedis!.hgetall(keyWithPrefix)
    }

    // Get zset values
    async getSet(key : string, returnScores? : boolean) {

        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis) {
            this.connect()
        }
        if(returnScores) {
            return await this._tedis!.zrange(keyWithPrefix, 0, -1, 'WITHSCORES')
        } else {
            return await this._tedis!.zrange(keyWithPrefix, 0, -1)
        }

    }

    async getAllKeys()
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.keys('*')
    }

    async remove(key : string)
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.del(keyWithPrefix) === 1 ? true : false
    }

    async rename(key : string, newKey : string) : Promise<any>
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.rename(keyWithPrefix, newKey)
    }

    async expireIn(key : string, seconds : number) : Promise<boolean>
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.expire(keyWithPrefix, seconds) === 1 ? true : false
    }

    async addToSet(key : string, memberId : string) {

        let keyWithPrefix = this.addKeyPrefix(key)

        // timestamp in seconds
        let timeStamp =  Math.round(+new Date()/1000)

        let setValue : any = {}
        setValue[memberId] = timeStamp

        if(!this._tedis)
        {
            this.connect()
        }

        return await this._tedis!.zadd(keyWithPrefix, setValue)
    }

    async removeFromSet(key: string, memberId : string) {

        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }

        return await this._tedis!.zrem(keyWithPrefix, memberId)
    }

    async type(key : string) {

        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.type(keyWithPrefix)
    }

    async transaction() {

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.command('multi')
    }

    async execute() {

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.command('exec')
    }

    async discard() {

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.command('discard')
    }

    async push(key : string, value : [string]) : Promise<number>
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        
        return await this._tedis!.rpush(keyWithPrefix, ...value)
    }

    async listLength(key : string)
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.llen(keyWithPrefix)
    }

    async getListContent(key : string)
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        let length = await this.listLength(keyWithPrefix)
        return await this._tedis!.lrange(keyWithPrefix, 0, length - 1)
    }

    async replaceAtPosition(key : string, index : number, newValue : string | number)
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.lset(keyWithPrefix, index, newValue)
    }

    async removeFromList(key : string, index : number, value : string)
    {
        let keyWithPrefix = this.addKeyPrefix(key)

        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.lrem(keyWithPrefix, index, value) === 1 ? true : false
    }

    close()
    {
        if(!this._tedis)
        {
            return
        }
        this._tedis.close()
    }

    private addKeyPrefix(key : string) 
    {
        return this._keyPrefix + ':' + key
    }
}
