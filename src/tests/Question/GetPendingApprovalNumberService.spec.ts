// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/../../../.env' })

// import { expect } from 'chai'
// import 'mocha'
// import Datastore from 'nedb'
// import container from './../../container'

// // Create the databases
// let db : { [key : string] : Datastore } = {}

// db.member = new Datastore()

// // Set up the test, container, dependencies

// import { GetPendingApprovalNumberService } from './../../wali-api/application'
// import { LocalSelectCountApprovalPendingMembersQuery }
//     from "../LocalPersistence"

// const getPendingApprovalNumberService = () => {
//     return new GetPendingApprovalNumberService(
//         new LocalSelectCountApprovalPendingMembersQuery(db.member),
//         container.get('WaliApproveList')
//     )
// }



// describe('Test GetPendingApprovalNumberService', ()=> {
//     it('Should return number', async ()=> {
//         let getPendingApprovalNumber = getPendingApprovalNumberService()

//         let result = await getPendingApprovalNumber.execute()

//         // Asserts
//         expect(result).to.be.a('number')

//     })


// })

