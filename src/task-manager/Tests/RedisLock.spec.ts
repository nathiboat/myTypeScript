import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import WaliQueueLockService from '../Domain/Services/WaliQueueLockService'
import Container from './../Infrastructure/DependencyContainer/Container'


describe('Test WaliQueueLockService ', () => {

    let redis = Container.get('RedisCache')

    it('Mutual exclusion test', async () => {

        let key = 'testing:lock:1';

        let lockOne = await redis.setNX(key, 'locked')
        let lockTwo = await redis.setNX(key, 'locked')

        await redis.deleteKey(key)

        expect(lockOne).to.equal(1)
        expect(lockTwo).to.equal(0)
    })

    it('Test deadlock free 2', async () => {
        let key = 'testing:lock:2';
        let ttl = 10
        let cacheLock = new WaliQueueLockService(redis, ttl, 6, 10)
        let expires
    
        cacheLock.setKey(key)

        await cacheLock.lock(async () => {
            
            expires = await redis.getTTL(key)

            expect(expires).to.equal(ttl);
        })
    })

})
