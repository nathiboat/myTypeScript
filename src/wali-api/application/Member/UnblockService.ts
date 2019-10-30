// import {
//     ISelectMemberByIdQuery,
//     IUpdateMemberCommand
// } from './../../domain';


// export default class UnblockService
// {
//     //Commands and Queries
//     private _selectMemberById: ISelectMemberByIdQuery

//     private _updateMember: IUpdateMemberCommand


//     constructor(
//         selectMemberById:  ISelectMemberByIdQuery,
//         updateMember:  IUpdateMemberCommand
//     ) {
//         this._selectMemberById = selectMemberById
//         this._updateMember = updateMember
//     }

//     async execute(id: number)
//     {
//         // 1. check if member is exist in database
//         let memberResult = await this._selectMemberById.execute(id);
//         let member = memberResult[0]

//         if (!member){
//             throw Error(`Member with ID ${id} was not found.`)
//         }

//         // 2. if this member is already been blocked stop execution.
//         if (!member.permanentlyBlocked) {
//             return `Member with ID ${id} have already been unblocked.`
//         }

//         // 3. update permanently block to true
//         member.setPermanentlyBlocked(false)
//         member.setOnline(false)
//         member.setPasswordToken(null)

//         await this._updateMember.execute(member)

//         return `Member with ID ${id} have already been unblocked.`
//     }

// }
