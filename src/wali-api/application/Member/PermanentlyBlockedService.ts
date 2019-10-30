// import {
//     Member,
//     ReportFactory,
//     ISelectMemberByIdQuery,
//     ISelectMemberByIdfaAndNotBlockedQuery,
//     IInsertMemberReportCommand,
//     IUpdateMemberCommand } from './../../domain'
// import FlagMemberService from './FlagMemberService'



// export default class PermanentlyBlockedService
// {
//     //Commands and Queries
//     private _selectMemberById : ISelectMemberByIdQuery

//     private _selectMemberByIdfaAndNotBlocked : ISelectMemberByIdfaAndNotBlockedQuery

//     private _insertMemberReport : IInsertMemberReportCommand

//     private _updateMember : IUpdateMemberCommand

//     //Service
//     private _flagMemberService : FlagMemberService

//     constructor(
//         selectMemberById: ISelectMemberByIdQuery,
//         selectMemberByIdfaAndNotBlocked: ISelectMemberByIdfaAndNotBlockedQuery,
//         insertMemberReport: IInsertMemberReportCommand,
//         updateMember: IUpdateMemberCommand,
//         flagMemberService: FlagMemberService
//     ) {
//         this._selectMemberById = selectMemberById
//         this._selectMemberByIdfaAndNotBlocked = selectMemberByIdfaAndNotBlocked
//         this._insertMemberReport = insertMemberReport
//         this._updateMember = updateMember
//         this._flagMemberService = flagMemberService
//     }

//     async execute(memberHashId: string)
//     {
//         let members : Member[] = []
//         let message = 'Member with ID ' + id

//         // 1. check if member is exist in database
//         let memberResult = await this._selectMemberById.execute(id);
//         let member = memberResult[0]

//         if(!member)
//         {
//             throw Error(`Member with ID ${id} was not found.`)
//         }

//         // 2. Add member to
//         members.push(member)

//         // 2. if this member is already been blocked stop execution.
//         if(member.permanentlyBlocked)
//         {
//             return `Member with ID ${id} have already been blocked.`
//         }

//         // 3. check member by IDFA
//         if(member.idfa)
//         {
//             let membersByIdfaResult = await this._selectMemberByIdfaAndNotBlocked.execute(member.idfa);
//             let membersByIdfa = membersByIdfaResult

//             membersByIdfa.forEach((member)  => {
//                 if(member.id !== members[0].id) {
//                     members.push(member)
//                 }
//             });
//         }

//         // 4. loop each member
//         members.forEach(async(member)=>
//         {
//             if(typeof member.id !== "number" )
//             {
//                 return
//             }

//             // 5. create report
//             let report = ReportFactory.build({
//                 memberId: member.id,
//                 reportingMemberId: 1,
//                 adminComment: "Permanently blocked",
//                 adminDecisionValidReport: 1,
//                 actioned: true
//             })
//             await this._insertMemberReport.execute(report)

//             // 6. update permanently block to true
//             member.setPermanentlyBlocked(true)
//             await this._updateMember.execute(member)

//             // 7. Flag member
//             await this._flagMemberService.execute(member.id)
//         })

//         let memberIds = members.map((item) => {
//             return item.id
//         }).join(',')

//         if(members.length > 1){
//             message += ' and duplicate accounts ' + memberIds + '. Using IDFA: ' + members[0].idfa
//         }

//         message += ' have been blocked.'

//         return message
//     }

// }
