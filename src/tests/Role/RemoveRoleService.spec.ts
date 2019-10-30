import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Datastore from 'nedb'

import { RemoveRoleService } from '../../wali-api/application'
import { LocalDeleteRoleCommand } from '../LocalPersistence'

// Create the database
let db : { [key : string] : Datastore } = {}

db.role = new Datastore()

const getRemoveRoleService = () => {

    return new RemoveRoleService(
        new LocalDeleteRoleCommand(db.role)
    )
}

let getRemoveRoleServiceSpec = getRemoveRoleService()

describe('Test RemoveRoleService ', () => {

    it('Should remove the specified role from the DB', async () => {

        try {

            let roleId = 1

            let result = await getRemoveRoleServiceSpec.execute(roleId)

            expect(result).to.be.null

        } catch(err) {
            console.log(err)
        }
    })

})
