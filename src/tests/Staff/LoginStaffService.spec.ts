// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/../../../.env' })
// import { LoginStaffService, LoginStaffResponse } from './../../wali-api/application'

// import { expect } from 'chai'
// import 'mocha'
// import Datastore from 'nedb'

// // Set up the test, container, dependencies
// import container from './../../container'
// import {
//     LocalSelectAllStaffsQuery,
//     LocalCheckPasswordHashService,
//     LocalSelectOneStaffByQuery,
//     LocalUpdateStaffCommand,
//     LocalGenerateTokenService,
//     LocalInsertStaffCommand,
//     LocalInsertStaffLogCommand
// } from "../LocalPersistence"

// // Create the database
// let db : { [key : string] : Datastore } = {}

// db.staffs = new Datastore()

// // const getService = ()=> {
// //     return new LoginStaffService(
// //         new LocalSelectAllStaffsQuery(db.staffs),
// //         new LocalCheckPasswordHashService(db.staff),
// //         new LocalSelectOneStaffByQuery(db.staffs),
// //         new LocalUpdateStaffCommand(),
// //         new LocalGenerateTokenService(db.staffs),
// //         new LocalInsertStaffLogCommand(db.staffs),
// //         new LoginStaffResponse
// //     )
// // }

// // describe('Test LoginStaffService', ()=> {
// //     it('Should check if token is valid', async ()=> {
// //         let LoginStaffService = getService()

// //         let result = await LoginStaffService.execute('777777',':1','FireFox')
        
// //         expect(result).to.be.a('object')
// //         expect(result.firstName).to.be.a('string')
// //         expect(result.token).not.equals('')
// //         expect(result.password).to.equal(undefined)
// //     })
// // })
