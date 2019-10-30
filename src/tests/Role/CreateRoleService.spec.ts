import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Datastore from 'nedb'

import { CreateRoleService } from './../../wali-api/application'
import { LocalInsertRoleCommand, LocalSelectRoleByNameAndProductQuery } from './../LocalPersistence'
import CreateRoleResponse from './../../wali-api/application/Role/CreateRole/CreateRoleResponse'

// Create the database
let db : { [key : string] : Datastore } = {}

db.insertRole = new Datastore()
db.selectRole = new Datastore()

const getCreateRoleService = () => {

    return new CreateRoleService(
        new LocalInsertRoleCommand(db.insertRole),
        new LocalSelectRoleByNameAndProductQuery(db.selectRole),
        new CreateRoleResponse(),

    )
}

let createRoleServiceSpec = getCreateRoleService()

describe('Test CreateRoleService ', () => {

    it('Should return the newly created Role', async () => {

        let roleName = 'test role'
        let productName = 'test product'
        let roleDescription = 'test description'

        try {
            let roleResult = await createRoleServiceSpec.execute(roleName, productName, roleDescription)

            expect(roleResult.productName).to.equal(productName)
            expect(roleResult.roleName).to.equal(roleName)
            expect(roleResult.roleDescription).to.equal(roleDescription)


        } catch(err) {
            console.log(err)
        }
    })

})
