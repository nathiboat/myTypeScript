// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/../../../.env' })

// import { expect } from 'chai'
// import 'mocha'
// import Datastore from 'nedb'

// // Set up the test, container, dependencies
// import container from './../../container'
// import { ApproveMemberService } from './../../wali-api/application'
// import { TestSNSPushNotification, TestXmppNotification, TestSendEmail } from './../Infrastructure'
// import { LocalInsertStaffLogCommand, LocalInsertMemberLogCommand, LocalUpdateMemberCommand } from './../LocalPersistence'
// import { PlatformFactory } from './../../wali-api/infrastructure/SNS'
// import { getLocalDatabaseContent, removeAllDatabaseDocs } from './../Helpers'
// import { WaliApproveLock } from './../../wali-api/infrastructure/WaliApproveLock'


// // Create the databases
// let db : { [key : string] : Datastore } = {}

// db.memberLogs = new Datastore()
// db.staffLogs  = new Datastore()
// db.rewards    = new Datastore() 
// db.members    = new Datastore() 

// const getApproveMemberService = ()=> {

//     let redis = container.get('RedisCache')
    
//     return new ApproveMemberService(
//         container.get('MemberDB.Commands.UpdateMemberApprovalCommand'),
//         container.get('MemberDB.Queries.SelectMemberByHashIdQuery'),
//         container.get('WaliApproveList'),
//         new LocalUpdateMemberCommand(db.members),
//         container.get('MemberDB.Queries.SelectMemberApprovalByIdQuery'),
//         new LocalInsertMemberLogCommand(db.memberLogs),
//         new LocalInsertStaffLogCommand(db.staffLogs),
//         new TestXmppNotification('', '', '', 0),
//         new TestSNSPushNotification(new PlatformFactory('', ''), '', ''),
//         container.get('RewardMemberService'),
//         container.get('MessageDB.Commands.InsertMessageCommand'),
//         container.get('MatchDB.Commands.UpdateLastMessageBodyCommand'),
//         new TestSendEmail('', '', ''),
//         redis
//     )
// }


// describe('Test ApproveMemberService', ()=> {
//     it('Should return true if supplied a list of all approved fields from the Wali2.0 frontend', async ()=> {

//         let approveMember = getApproveMemberService()

//         let staffId = 1
//         let memberHashId = '6bd907d102c3f44dd7c97305c05e829b6fe67edf25b83c43ba1f3fee043f7a90' // member id 131
//         let answers =  [
//             { answer: 'yes', field: 'photoVerification' },
//             { answer: 'yes', field: 'photo1' },
//             { answer: 'yes', field: 'photo2' },
//             { answer: 'yes', field: 'photo3' },
//             { answer: 'yes', field: 'photo4' },
//             { answer: 'yes', field: 'photo5' },
//             { answer: 'yes', field: 'statusMessage' },
//             { answer: 'yes', field: 'longDescription' }
//         ]

//         let result = await approveMember.execute(memberHashId, answers, staffId)

//         let staffLogs = await getLocalDatabaseContent(db.staffLogs)
//         await removeAllDatabaseDocs(db.staffLogs)

//         let members = await getLocalDatabaseContent(db.members)
//         await removeAllDatabaseDocs(db.members)
        
//         // let memberLogs = await getLocalDatabaseContent(db.memberLogs)
//         // await removeAllDatabaseDocs(db.memberLogs)

//         // Verify staff log
//         let staffLog = staffLogs[0]
//         expect(staffLog._eventCode).to.equal('PROFILE_APPROVED')
//         expect(staffLog._memberId).to.equal(131)
//         expect(staffLog._action).to.equal('profileCreated=2 fields=photoVerification,photo1,photo2,photo3,photo4,photo5,statusMessage,longDescription')

//         // Verify member log
//         // No member logs found, we need to somehow alter the user profile that is passed inside

//         // Verify member getting udpated
//         let member = members[0]
//         expect(member._approved).to.equal(1)
//         expect(member._profileReviewedByAdmin).to.equal(1)

//         expect(result).to.equal(true)
//     })

//     it('Should return true if supplied a rejected photo or status in the payload list coming from the Wali2.0 frontend', async ()=> {

//         let approveMember = getApproveMemberService()

//         let staffId = 1
//         let memberHashId = '6bd907d102c3f44dd7c97305c05e829b6fe67edf25b83c43ba1f3fee043f7a90' // member id 131
//         let answers =  [
//             { answer: 'yes', field: 'photoVerification' },
//             { answer: 'yes', field: 'photo1' },
//             { answer: 'no', field: 'photo2' },
//             { answer: 'no', field: 'photo3' },
//             { answer: 'yes', field: 'photo4' },
//             { answer: 'yes', field: 'photo5' },
//             { answer: 'no', field: 'statusMessage' },
//             { answer: 'yes', field: 'longDescription' }
//         ]

//         let result = await approveMember.execute(memberHashId, answers, staffId)

//         let staffLogs = await getLocalDatabaseContent(db.staffLogs)
//         await removeAllDatabaseDocs(db.staffLogs)

//         let members = await getLocalDatabaseContent(db.members)
//         await removeAllDatabaseDocs(db.members)
        
//         // let memberLogs = await getLocalDatabaseContent(db.memberLogs)
//         // await removeAllDatabaseDocs(db.memberLogs)

//         // Verify staff log
//         let staffLog = staffLogs[0]
//         expect(staffLog._eventCode).to.equal('PROFILE_APPROVED')
//         expect(staffLog._memberId).to.equal(131)
//         expect(staffLog._action).to.equal('profileCreated=2 fields=photoVerification,photo1,photo2,photo3,photo4,photo5,statusMessage,longDescription')


//         // Verify member getting udpated
//         let member = members[0]
//         expect(member._approved).to.equal(1)
//         expect(member._profileReviewedByAdmin).to.equal(1)

//         expect(result).to.equal(true)

//     })


//     it('Should return false if supplied a rejected description in the payload list coming from the Wali2.0 frontend', async ()=> {

//         let approveMember = getApproveMemberService()

//         let staffId = 1
//         let memberHashId = '6bd907d102c3f44dd7c97305c05e829b6fe67edf25b83c43ba1f3fee043f7a90' // member id 131
//         let answers =  [
//             { answer: 'yes', field: 'photoVerification' },
//             { answer: 'yes', field: 'photo1' },
//             { answer: 'no', field: 'photo2' },
//             { answer: 'no', field: 'photo3' },
//             { answer: 'yes', field: 'photo4' },
//             { answer: 'yes', field: 'photo5' },
//             { answer: 'yes', field: 'statusMessage' },
//             { answer: 'no', field: 'longDescription' }
//         ]

//         let result = await approveMember.execute(memberHashId, answers, staffId)

//         let staffLogs = await getLocalDatabaseContent(db.staffLogs)
//         await removeAllDatabaseDocs(db.staffLogs)

//         let members = await getLocalDatabaseContent(db.members)
//         await removeAllDatabaseDocs(db.members)
        
//         // let memberLogs = await getLocalDatabaseContent(db.memberLogs)
//         // await removeAllDatabaseDocs(db.memberLogs)

//         // Verify staff log
//         let staffLog = staffLogs[0]
//         expect(staffLog._eventCode).to.equal('PROFILE_NOT_APPROVED')
//         expect(staffLog._memberId).to.equal(131)
//         expect(staffLog._action).to.equal('profileCreated=2 fields=photoVerification,photo1,photo2,photo3,photo4,photo5,statusMessage,longDescription')


//         // Verify member getting udpated
//         let member = members[0]
//         expect(member._approved).to.equal(0)
//         expect(member._profileReviewedByAdmin).to.equal(1)

//         expect(result).to.equal(false)

//     })
// })

