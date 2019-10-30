// import {StaffFactory, RoleFactory, ISelectAllStaffQuery, Staff} from '../../../wali-api/domain'
// import Datastore from 'nedb'
// import { getLocalDatabaseContent } from '../../Helpers'

// export default class LocalSelectAllStaffsQuery implements ISelectAllStaffQuery
// {
//     private _db : Datastore

//     constructor(db : Datastore)
//     {
//         this._db = db
//     }

//     async execute() : Promise<Staff[]>
//     {
//         // Check the in memory database for previous inserted staff
//         let staffs: Staff[] = []


//         if(staffs.length === 0)
//         {
//             staffs.push(StaffFactory.build({
//                 firstName: 'Andrew',
//                 lastName: 'Smith',
//                 email:  'john@smith.com',
//                 id:  1,
//                 token: 'qwertyuiop'
//             }))

//             staffs.push(StaffFactory.build({
//                 firstName: 'Smith',
//                 lastName: 'Balloon',
//                 email:  'Smith@Balloon.com',
//                 id:  2,
//                 token: 'asdfghjkl'
//             }))
//         }

//         return staffs
//     }
// }
