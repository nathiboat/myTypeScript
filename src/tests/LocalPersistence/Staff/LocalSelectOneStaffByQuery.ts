// import { ISelectOneStaffByQuery, StaffFactory, RoleFactory } from '../../../wali-api/domain'
// import Datastore from 'nedb'
// import { getLocalDatabaseContent } from '../../Helpers'

// export default class LocalSelectOneStaffByQuery implements ISelectOneStaffByQuery
// {
//     private _db : Datastore

//     constructor(db : Datastore)
//     {
//         this._db = db
//     }

//     async execute(request : { [key : string] : string | number })
//     {
//         let key = Object.keys(request)[0]
//         let value = Object.values(request)[0]

//         // Check the in memory database for previous inserted staff
//         let staffs = await getLocalDatabaseContent(this._db)

//         // If no previous staff was inserted, then create a new fake one
//         if(staffs.length === 0)
//         {
//             let staff = StaffFactory.build({
//                 firstName: 'Andrew',
//                 lastName: 'Smith',
//                 email: (key === 'email' ? <string>value : 'john@smith.com'),
//                 id: (key === 'id' ? <number>value : 1),
//                 token: (key === 'token' ? <string>value : 'qwertyuiop')
//             })

//             staff.addRole(RoleFactory.build({
//                 productName: 'approve',
//                 roleName: 'approve'
//             }))

//             return staff
//         }

//         // If previous inserted staff is found then parse it into a model
//         let result = staffs.filter((staff)=> {
//             return staff[`_${ key }`] === value
//         }).map((rawStaff)=> {
//             let staff = StaffFactory.build({
//                 firstName: rawStaff._firstName,
//                 lastName: rawStaff._lastName,
//                 email: rawStaff._email,
//                 id: rawStaff._id
//             })

//             rawStaff._roles.map((rawRole : { [key : string] : any })=> {
//                 let role = RoleFactory.build({
//                     productName: rawRole._productName,
//                     roleName: rawRole._roleName,
//                     id: rawRole._id
//                 })
//                 staff.addRole(role)
//             })

//             return staff
//         })[0]

//         return result
//     }
// }
