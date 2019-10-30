// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/../../../.env' })
// import { AuthenticateStaffService } from './../../wali-api/application';

// import { expect } from 'chai'
// import 'mocha'
// import Datastore from 'nedb'

// import { LocalSelectOneStaffByQuery, LocalCheckTokenService } from "../LocalPersistence"

// // Create the database
// let db : { [key : string] : Datastore } = {}

// db.staff = new Datastore()

// const getAuthenticateStaffService = ()=> {
//     return new AuthenticateStaffService(
//         new LocalSelectOneStaffByQuery(db.staff),
//         new LocalCheckTokenService(db.staff)
//     )
// }

// describe('Test AuthenticateStaffService', ()=> {

//     it('Should return true if the staff has permission to access the route', async ()=> {

//         let AuthenticateStaffService = getAuthenticateStaffService()

//         let token = 'sdfsdfsdfsdafs'
//         let path = '/member/approve?'

//         let result = await AuthenticateStaffService.execute(token, path)

//         expect(result).to.be.true
//     })

//     it('Should return false if the path is not valid', async ()=> {

//         let AuthenticateStaffService = getAuthenticateStaffService()

//         let token = 'sdfsdfsdfsdafs'
//         let path = '?/member/approve'

//         let result = await AuthenticateStaffService.execute(token, path)

//         expect(result).to.be.false
//     })

//     it('Should return false if the staff does not have permission to access the route ', async ()=> {

//         let AuthenticateStaffService = getAuthenticateStaffService()

//         let token = 'sdfsdfsdfsdafs'
//         let path = '/member/team?'

//         let result = await AuthenticateStaffService.execute(token, path)

//         expect(result).to.be.false
//     })
// })
