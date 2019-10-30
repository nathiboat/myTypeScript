import { ICache, IWaliApproveList } from './../../application'


export default class WaliApproveList implements IWaliApproveList
{
    private _cache : ICache

    private _key : string 

    private _expire? : number


    constructor(key : string, cache : ICache, expire? : number)
    {
        this._key    = key
        this._cache  = cache
        this._expire = expire
    }

    async push(ids : number[])
    {        
        await this._cache.push(this._key, ids.map(id => id.toString()))
        await this._cache.expireIn(this._key, this._expire || 60 * 5)
    }

    async content()
    {
        let content = await this._cache.getListContent(this._key)
        return content.map(id => parseInt(id))
    }

    async remove(id : number)
    {
        return await this._cache.removeFromList(this._key, 0, id.toString())
    }
}