import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import container from './../../container'
import { WaliApproveLock } from './../../wali-api/infrastructure/WaliApproveLock'


const getService = ()=> {
    let redis = container.get('RedisCache')
    return new WaliApproveLock('test-list', redis)
}
describe('Test WaliApproveLock', ()=> {
    it('Should return a list of queue members from Redis cache after you inserted them', async ()=> {
        let lockService = getService()

        await lockService.push({
            memberId: 1,
            staffId: 2,
            ttl: lockService.addExpireIn(2)
        })

        let content = await lockService.get()

        expect(content[0].memberId).to.equal(1)
        expect(content[0].staffId).to.equal(2)
    })

    it('Should update the lock not insert a new one if memberId is already in the list', async ()=> {
        let lockService = getService()

        await lockService.push({
            memberId: 1,
            staffId: 2,
            ttl: lockService.addExpireIn(2)
        })

        await lockService.push({
            memberId: 1,
            staffId: 33,
            ttl: lockService.addExpireIn(2)
        })

        let content = await lockService.get()

        expect(content[0].memberId).to.equal(1)
        expect(content[0].staffId).to.equal(33)
    })

    it('Should return the expire date plus 2 minutes from the addExpireIn method', async ()=> {
        let lockService = getService()

        let expireIn = lockService.addExpireIn(2)

        await lockService.push({
            memberId: 1,
            staffId: 2,
            ttl: expireIn
        })

        let content = await lockService.get()

        expect(content[0].ttl).to.equal(expireIn)
    })

    it('Should allow the removal of a member lock', async ()=> {
        let lockService = getService()

        let expireIn = lockService.addExpireIn(2)

        await lockService.push({
            memberId: 1,
            staffId: 2,
            ttl: expireIn
        })

        await lockService.removeMember(1)

        let content = await lockService.get()

        expect(content.length).to.equal(0)
    })
})