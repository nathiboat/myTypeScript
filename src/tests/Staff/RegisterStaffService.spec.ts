// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/../../../.env' })

// import { expect } from 'chai'
// import 'mocha'
// import Datastore from 'nedb'

// // Set up the test, container, dependencies
// import container from './../../container'
// import { RegisterStaffService, RegisterStaffResponse } from './../../wali-api/application';
// import { LocalSelectRoleIncludeIdsQuery, LocalInsertStaffCommand, LocalSelectOneStaffByQuery } from './../LocalPersistence'
// import { TestSendEmail } from './../Infrastructure'
// import { removeAllDatabaseDocs } from './../Helpers'


// // Create the database
// let db : { [key : string] : Datastore } = {}

// db.staffs = new Datastore()


// const getService = ()=> {
//     return new RegisterStaffService(
//         new LocalInsertStaffCommand(db.staffs),
//         new LocalSelectRoleIncludeIdsQuery(),
//         new LocalSelectOneStaffByQuery(db.staffs),
//         new TestSendEmail('', '', ''),
//         new RegisterStaffResponse()
//     )
// }


// describe('Test RegisterStaffService', ()=> {
//     it('Should return the new create Staff once it was saved in the database', async ()=> {
//         let registerService = getService()

//         let result = await registerService.execute(
//             [1, 2, 3],
//             'John',
//             'Smith',
//             'john@smith.com',
//             'the new guy from the office'
//         )
//         // Clear the database for future tests
//         await removeAllDatabaseDocs(db.staffs)

//         expect(result.roles[0].id).to.equal(1)
//         expect(result.roles[1].id).to.equal(2)
//         expect(result.roles[2].id).to.equal(3)
        
//         expect(result.firstName).to.equal('John')
//         expect(result.lastName).to.equal('Smith')
//         expect(result.email).to.equal('john@smith.com')
//     })
// })