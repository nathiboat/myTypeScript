import { Tedis } from 'tedis'
import { ICache } from './../../../Domain'


export default class RedisCache implements ICache
{
    private _tedis? : Tedis

    constructor(private _host : string, private _port : number)
    {
        //
    }

    // Connection methods
    connect()
    {
        this._tedis = new Tedis({
            port: this._port,
            host: this._host
        })
    }

    isConnected()
    {
        return this._tedis === undefined ? false : true
    }

    close()
    {
        if(!this._tedis)
        {
            throw Error('Cache client is undefined')
        }
        this._tedis.close()
        this._tedis = undefined
    }

    // Key methods
    async deleteKey(key : string)
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.del(key) ? true : false
    }

    async existKey(key : string)
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.exists(key) ? true : false
    }

    async expireKey(key : string, seconds : number)
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.expire(key, seconds) ? true : false
    }

    async getAllKeys()
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return this._tedis!.keys('*')
    }

    // String methods
    async setString(key : string, value : string) : Promise<any>
    {
        if(!this._tedis)
        {
            this.connect()
        }
        await this._tedis!.set(key, value)
    }

    async getString(key : string) : Promise<string | number | null>
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.get(key)
    }

    async setNX(key : string, value : string) : Promise<string | number | null> {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.setnx(key, value)  
    }

    async getTTL(key : string) {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.command("TTL", key)
    }

    // List methods
    async pushInList(key : string, value : string)
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.rpush(key, value) ? true : false
    }

    async getElementsInList(key : string) : Promise<string[]>
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.lrange(key, 0, -1)
    }

    async removeFromList(key : string, index : number, value : string) : Promise<boolean>
    {
        if(!this._tedis)
        {
            this.connect()
        }
        return await this._tedis!.lrem(key, index, value) === 1 ? true : false
    }
}