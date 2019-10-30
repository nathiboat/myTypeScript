// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/../../../.env' })

// import { expect } from 'chai'
// import 'mocha'
// import Datastore from 'nedb'

// // Set up the test, container, dependencies
// import container from './../../container'
// import { UpdateStaffService, UpdateStaffResponse } from './../../wali-api/application'
// import { TestSendEmail } from './../Infrastructure'
// import { LocalSelectOneStaffByQuery, LocalSelectRoleIncludeIdsQuery, LocalUpdateStaffCommand } from './../LocalPersistence'
// import { removeAllDatabaseDocs } from './../Helpers'

// // Create the database
// let db : { [key : string] : Datastore } = {}

// db.staffs = new Datastore()


// const getService = ()=> {
//     return new UpdateStaffService(
//         // container.get('StaffDB.Queries.SelectOneStaffByQuery'),
//         new LocalSelectOneStaffByQuery(db.staffs),
//         new LocalUpdateStaffCommand(),
//         new LocalSelectRoleIncludeIdsQuery(),
//         new TestSendEmail('', '', ''),
//         new UpdateStaffResponse()
//     )
// }

// describe('Test UpdateStaffService', ()=> {
//     it('Should return an updated Staff model after passing the new props', async ()=> {
        
//         let updateStaffService = getService()
       
//         let result = await updateStaffService.execute(
//             [1, 2, 3],
//             1,
//             'Bob',
//             'Smith',
//             'john@smith.com',
//             'the new guy from the office'
//         )
//         await removeAllDatabaseDocs(db.staffs)

//         expect(result.roles[0].id).to.equal(1)
//         expect(result.roles[1].id).to.equal(2)
//         expect(result.roles[2].id).to.equal(3)
        
//         expect(result.firstName).to.equal('Bob')
//         expect(result.lastName).to.equal('Smith')
//         expect(result.email).to.equal('john@smith.com')
//     })
// })
