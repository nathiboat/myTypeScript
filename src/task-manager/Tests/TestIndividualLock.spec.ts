import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Container from './../Infrastructure/DependencyContainer/Container'


// Set a lock
// Run a code in the callback if lock is not set
// Do not run a code in the callback if lock is set
// Throw an error if the lock is still set after X attempts

describe('Test Individual Lock Service', ()=> {

    it('Should be able to set a lock and remove it after finishing the work', async ()=> {

        let lock = Container.get('Lock')
        try {
            lock.individualLock.setKey('test-individual-lock')
            let result = await lock.individualLock.lock(()=> {
                return 123
            })
            await lock.individualLock.unlock()

            let isLocked = await lock.individualLock.isLocked()
            
            expect(result).to.equal(123)
            expect(isLocked).to.equal(false)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should allow to run a code in the callback if lock is not set', async ()=> {

        let lock = Container.get('Lock')
        try {
            lock.individualLock.setKey('test-individual-lock')
            let result = await lock.individualLock.lock(async ()=> {
                return await new Promise((resolve) => {
                    setTimeout(()=> {
                        resolve(123)
                    }, 400)
                })
            })
            await lock.individualLock.unlock()
            let isLocked = await lock.individualLock.isLocked()
            
            expect(result).to.equal(123)
            expect(isLocked).to.equal(false)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should NOT allow to run a code in the callback if lock IS set', async ()=> {

        let lock = Container.get('Lock')
        let redis = Container.get('RedisCache')
        try {
            await redis.setString('test-individual-lock', 'locked') // Set lock as locked
            lock.individualLock.setKey('test-individual-lock')
            let result = await lock.individualLock.lock(async ()=> {
                return await new Promise((resolve) => {
                    setTimeout(()=> {
                        resolve(123)
                    }, 400)
                })
            })

        } catch(err) {
            let isLocked = await lock.individualLock.isLocked()
            await lock.individualLock.unlock()
            
            expect(isLocked).to.equal(true)
            expect(err.name).to.equal('Error')
            expect(err.message).to.equal('Could not get the lock after 11 tries')
            
        }
    })
})
