import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Datastore from 'nedb'

import { GetRolesService } from '../../wali-api/application'
import { LocalSelectAllRolesQuery } from '../LocalPersistence'
import CreateRoleResponse from '../../wali-api/application/Role/CreateRole/CreateRoleResponse'

// Create the database
let db : { [key : string] : Datastore } = {}

db.roles = new Datastore()

const getRolesService = () => {

    return new GetRolesService(
        new LocalSelectAllRolesQuery(db.roles),
        new CreateRoleResponse(),
    )
}

let getRolesServiceSpec = getRolesService()

describe('Test GetRolesService ', () => {

    it('Should return all the roles in the DB', async () => {

        try {
            let roleResult = await getRolesServiceSpec.execute()

            expect(roleResult[0]._productName).to.be.equal('dashboard')
            expect(roleResult[0]._roleName).to.be.equal('admin')
            expect(roleResult[1]._productName).to.be.equal('team')
            expect(roleResult[1]._roleName).to.be.equal('community')

        } catch(err) {
            console.log(err)
        }
    })

})
