// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/../../../.env' })
// import { GetLoggedInStaffService, GetLoggedInStaffResponse } from './../../wali-api/application';

// import { expect } from 'chai'
// import 'mocha'
// import Datastore from 'nedb'

// // Set up the test, container, dependencies
// import container from './../../container'
// import { LocalSelectOneStaffByQuery, LocalCheckTokenService } from "../LocalPersistence"

// // Create the database
// let db : { [key : string] : Datastore } = {}

// db.staffs = new Datastore()

// const getService = ()=> {
//     return new GetLoggedInStaffService(
//         new LocalSelectOneStaffByQuery(db.staffs),
//         new LocalCheckTokenService(db.staffs),
//         new GetLoggedInStaffResponse()
//     )
// }

// describe('Test GetLoggedInStaffService', ()=> {
//     it('Should check if token is valid', async ()=> {
//         let getOneStaffService = getService()

//         let result = await getOneStaffService.execute('sdfsdfsadfasdf')

//         expect(result).to.be.a('object')
//         expect(result.firstName).to.be.a('string')
//         expect(result.token).not.equals('')
//     })
// })
