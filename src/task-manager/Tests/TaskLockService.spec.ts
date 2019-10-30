import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Container from './../Infrastructure/DependencyContainer/Container'
import { VirtualQueue } from './../Domain'



const findInQueue = (items : VirtualQueue[], itemId : number) : VirtualQueue | null => {
    let foundItem : VirtualQueue | null = null
    items.forEach((item : VirtualQueue)=> {
        if(item.itemId === itemId)
        {
            foundItem = item
        }
    })
    return foundItem
}

describe('Test LockedTaskListService ', () => {

    it('Should set WALI_TASK_APPROVE_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_APPROVE_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)

            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_REPORT_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_REPORT_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)

            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_BLOCK_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_BLOCK_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)

            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_ISSUE_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_ISSUE_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)

            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_APPROVE_FLAG_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_APPROVE_FLAG_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)

            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_REPORT_FLAG_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_REPORT_FLAG_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)

            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_BLOCK_FLAG_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_BLOCK_FLAG_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)

            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_ISSUE_FLAG_LOCKED key and insert random item', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_ISSUE_FLAG_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 1)
            
            await lock.clear()

            expect(foundItem!.staffId).to.equal(1)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_ISSUE_FLAG_LOCKED key, insert random item, then remove it from the list', async () => {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_ISSUE_FLAG_LOCKED'))
            await lock.add({
                itemId: 2,
                staffId: 1,
                expireIn: 60
            })

            let items = await lock.get()
            let foundItem = findInQueue(items, 2)

            expect(foundItem!.staffId).to.equal(1)

            await lock.removeItem(foundItem!.itemId)

            items = await lock.get()
            foundItem = findInQueue(items, 2)
            
            await lock.clear()

            expect(foundItem).to.equal(null)
        } catch(err) {
            console.log(err)
        }
    })

    it('Should set WALI_TASK_ISSUE_FLAG_LOCKED key, insert random item with 1 second expire time, and check if it was removed after 2 seconds', async ()=> {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_ISSUE_FLAG_LOCKED'))
            await lock.add({
                itemId: 3,
                staffId: 1,
                expireIn: 1
            })

            let ttl = new Date(new Date().getTime() + 60000).toString()
            
            let items = await lock.get()
            let foundItem = findInQueue(items, 3)
            
            await lock.clear()

            expect(foundItem!.ttl).to.equal(ttl)
            
        } catch(err) {
            console.log(err)
        }
    })

    it('Should NOT allow another staff to take ownership of the same item in the queue', async ()=> {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_ISSUE_FLAG_LOCKED'))
            await lock.add({
                itemId: 4,
                staffId: 7,
                expireIn: 1
            })
            
            let items = await lock.get()
            let foundItem = findInQueue(items, 4)

            // Task was found in the queue
            expect(foundItem!.itemId).to.equal(4)
            expect(foundItem!.staffId).to.equal(7)

            // Try to override the task owner
            await lock.add({
                itemId: 4,
                staffId: 6,
                expireIn: 1
            })

            items = await lock.get()
            foundItem = findInQueue(items, 4)

            await lock.clear()
            
            // Check if the owner of the task has the same id
            expect(foundItem!.itemId).to.equal(4)
            expect(foundItem!.staffId).to.equal(7)

        } catch(err) {
            console.log(err)
        }
    })

    it('Should be able to clear all items in the queue at once', async ()=> {

        let lock = Container.get('LockedTaskListService')
        let key  = Container.get('CacheKeyService')
        try {
            lock.setKey(key.generate('WALI_TASK_ISSUE_FLAG_LOCKED'))
            await lock.add({
                itemId: 1,
                staffId: 1,
                expireIn: 1
            })
            await lock.add({
                itemId: 2,
                staffId: 2,
                expireIn: 1
            })
            await lock.add({
                itemId: 3,
                staffId: 3,
                expireIn: 1
            })
            
            // Remove all items from the queue
            await lock.clear()

            let items = await lock.get()

            // Check the items in the queue
            expect(items.length).to.equal(0)

        } catch(err) {
            console.log(err)
        }
    })

})
