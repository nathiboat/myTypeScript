import ICache from '../Shared/ICache'
import IWaliQueueLockService from './IWaliQueueLockService'

export default class WaliQueueLockService implements IWaliQueueLockService
{
    private _key? : string
    
    constructor(
        private _cache : ICache, 
        private _expire : number, // seconds
        private _retryCount : number,
        private _retryInterval : number)
    {
        //
    }

    private async sleep(interval : number)
    {
        return new Promise(resolve=>{
            setTimeout(resolve, interval)
        })
    }

    setKey(key : string)
    {
        this._key = key
    }

    async lock(callback : Function) { 
        
        if(!this._key) {
            throw Error('The key is not set')
        }

        let count : number = 0
        let key = this._key

        while(count <= this._retryCount) {
            if(await this.acquireTheLock(key)) { 
                try {  
                    return await callback();
                } finally {
                    await this.unlockKey(key);
                }
            } else {
                await this.sleep(this._retryInterval)
            }
            count++
        }

        // I couldn't get the lock after x amount of retry so close the connection and go away
        this._cache.close()
        throw Error(`Could not get the lock after ${ count } tries`)
    }

   async unlock() : Promise<boolean> {
        if(!this._key) {
            throw Error('The key is not set')
        }    
        return this.unlockKey(this._key)
    }


   private async unlockKey(key: string) : Promise<boolean> {
       let result = await this._cache.deleteKey(key)
       this._cache.close()
       return result
   }

    private async acquireTheLock(key : string) {
        
        let result = await this._cache.setNX(key, 'locked')
        if (result) {
            await this._cache.expireKey(key, this._expire)
        }
        return result;
    }
}