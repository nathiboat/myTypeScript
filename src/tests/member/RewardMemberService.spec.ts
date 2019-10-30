import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Datastore from 'nedb'

// Set up the test, container, dependencies
import container from './../../container'

import { LocalUpdateMemberRewardTransaction, LocalUpdateMemberCommand } from './../LocalPersistence'
import { 
    Answer, 
    MessageFactory, 
    EmailFactory, 
    MemberLogFactory } from './../../wali-api/domain'
import { 
    RewardService, 
    RewardWithReferrerMember, 
    RewardFromInviteCode, 
    BuildRewardFromInviteCode, 
    BuildRejectMessageBody, 
    BuildRejectEmailBody, 
    RewardDefault } from './../../wali-api/application'

import { getLocalDatabaseContent, removeAllDatabaseDocs } from './../Helpers'

let selectMember = container.get('MemberDB.Queries.SelectMemberByIdQuery')

let db : { [key : string] : Datastore } = {}

db.members = new Datastore()
db.rewards = new Datastore()

let memberRewardTransaction = new LocalUpdateMemberRewardTransaction(db.rewards)
let updateMember            = new LocalUpdateMemberCommand(db.members)

const getRewardMemberService = ()=> {
    
    let buildRewardFromInviteCode = new BuildRewardFromInviteCode(
        memberRewardTransaction,
        container.get('Locale')
    )

    let rewardWithReferrer = new RewardWithReferrerMember(
        updateMember,
        container.get('MemberDB.Queries.SelectMemberByIdQuery'),
        container.get('MatchDB.Queries.SelectMatchIdQuery'),
        container.get('InviteCodeDB.Queries.SelectInviteCodesQuery'),
        container.get('Locale'),
        buildRewardFromInviteCode
    )

    let rewardInviteCode = new RewardFromInviteCode(
        container.get('InviteCodeDB.Queries.SelectInviteCodesQuery'),
        buildRewardFromInviteCode,
        container.get('MatchDB.Queries.SelectMatchIdQuery'),
        container.get('Locale')
    )

    let rewardDefault = new RewardDefault(
        updateMember,
        container.get('MatchDB.Queries.SelectMatchIdQuery'),
        container.get('Locale')
    )

    let buildRejectMessageBody = new BuildRejectMessageBody(container.get('Locale'))

    let buildRejectEmailBody = new BuildRejectEmailBody(container.get('Locale'))

    let service = new RewardService(
        rewardWithReferrer,
        rewardInviteCode,
        rewardDefault,
        buildRejectMessageBody,
        buildRejectEmailBody,
        updateMember,
        container.get('MatchDB.Queries.SelectMatchIdQuery'),
        container.get('Locale')
    )
    return service
}

// Cases
// 1. All fields are approved, with invitation code, with referrer code and with no code
// 2. One photo is not approved, with invitation code, with referrer code and with no code
// 3. Status is not approved, with invitation code, with referrer code and with no code
// 4. Description is not approved
// 5. All fields are not approved


describe('Test RewardMemberService', ()=> {
    // ! All fields are approved
    it('All fields are approved, with invitation code MLS18', async ()=> {
        
        let rewardService = getRewardMemberService()

        let answer = new Answer([
            { answer: 'yes', field: 'photoVerification' },
            { answer: 'yes', field: 'photo1' },
            { answer: 'yes', field: 'photo2' },
            { answer: 'yes', field: 'photo3' },
            { answer: 'yes', field: 'photo4' },
            { answer: 'yes', field: 'photo5' },
            { answer: 'yes', field: 'statusMessage' },
            { answer: 'yes', field: 'longDescription' }
        ])

        // Get the member with id 131
        let memberResult = await selectMember.execute(131)
        let member = memberResult[0]

        // Modify the member to suit the test
        member.approvalState = 1
        member.setReferrerInviteCode('MLS18')

        // Run the service
        let result = await rewardService.approved(member, answer)

        let rewards = await getLocalDatabaseContent(db.rewards)
        await removeAllDatabaseDocs(db.rewards)

        console.log('BONUS MARKETING CODE', result, rewards)

        // Check rewards saved in databse
        expect(rewards[0].instantMatch).to.equal(5)
        expect(rewards[0].swipe).to.equal(0)
        expect(rewards[0].premiumDays).to.equal(0)
        expect(rewards[0].memberId).to.equal(131)

        // // Asserts
        // expect(result.messages).to.be.a('array')
        // expect(result.emails).to.be.a('array')
        // expect(result.logs).to.be.a('array')
        expect(result.messages.length).to.equal(8)
        expect(result.emails.length).to.equal(1)
        expect(result.logs.length).to.equal(1)
    })

    it('All fields are approved, with referrer code from 132', async ()=> {

        let rewardService = getRewardMemberService()

        let answer = new Answer([
            { answer: 'yes', field: 'photoVerification' },
            { answer: 'yes', field: 'photo1' },
            { answer: 'yes', field: 'photo2' },
            { answer: 'yes', field: 'photo3' },
            { answer: 'yes', field: 'photo4' },
            { answer: 'yes', field: 'photo5' },
            { answer: 'yes', field: 'statusMessage' },
            { answer: 'yes', field: 'longDescription' }
        ])

        // Get the member with id 131
        let memberResult = await selectMember.execute(131)
        let member = memberResult[0]

        let referreMemberResult = await selectMember.execute(132)
        let referrerMember = referreMemberResult[0]

        referrerMember.approvalState = 2

        // Modify the member to suit the test
        member.approvalState = 1
        member.setReferrerMemberId(132)

        // Run the service
        let result = await rewardService.approved(member, answer)

        let rewards = await getLocalDatabaseContent(db.rewards)
        await removeAllDatabaseDocs(db.rewards)

        let members = await getLocalDatabaseContent(db.members)
        await removeAllDatabaseDocs(db.members)

        console.log('REFERRER CODE', result, rewards)
        // Check if the member was updated

        // Check rewards saved in databse
        // expect(rewards[0].instantMatch).to.equal(10)
        // expect(rewards[0].swipe).to.equal(10)
        // expect(rewards[0].premiumDays).to.equal(0)
        // expect(rewards[0].memberId).to.equal(131)

        // // Asserts
        // expect(result.messages).to.be.a('array')
        // expect(result.emails).to.be.a('array')
        // expect(result.logs).to.be.a('array')
        // expect(result.messages.length).to.equal(4)
        // expect(result.emails.length).to.equal(1)
        // expect(result.logs.length).to.equal(1)
    })

    it('All fields are approved, with no code', async ()=> {
        
        let rewardService = getRewardMemberService()

        let answer = new Answer([
            { answer: 'yes', field: 'photoVerification' },
            { answer: 'yes', field: 'photo1' },
            { answer: 'yes', field: 'photo2' },
            { answer: 'yes', field: 'photo3' },
            { answer: 'yes', field: 'photo4' },
            { answer: 'yes', field: 'photo5' },
            { answer: 'yes', field: 'statusMessage' },
            { answer: 'yes', field: 'longDescription' }
        ])

        // Get the member with id 131
        let memberResult = await selectMember.execute(131)
        let member = memberResult[0]

        // Modify the member to suit the test
        member.approvalState = 1
        // member.setReferrerInviteCode('MLS18')

        // Run the service
        let result = await rewardService.approved(member, answer)

        let rewards = await getLocalDatabaseContent(db.rewards)
        await removeAllDatabaseDocs(db.rewards)

        console.log('NO CODE', result, rewards)
        // Check rewards saved in databse
        // expect(rewards[0].instantMatch).to.equal(10)
        // expect(rewards[0].swipe).to.equal(10)
        // expect(rewards[0].premiumDays).to.equal(0)
        // expect(rewards[0].memberId).to.equal(131)

        // // Asserts
        // expect(result.messages).to.be.a('array')
        // expect(result.emails).to.be.a('array')
        // expect(result.logs).to.be.a('array')
        // expect(result.messages.length).to.equal(4)
        // expect(result.emails.length).to.equal(1)
        // expect(result.logs.length).to.equal(1)
    })


    // // ! One photo is not approved
    // it('All fields are approved, with invitation code MLS18', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('BONUS MARKETING CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with referrer code from 132', async ()=> {

    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     let referreMemberResult = await selectMember.execute(132)
    //     let referrerMember = referreMemberResult[0]

    //     referrerMember.approvalState = 2

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerMemberId(132)

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     let members = await getLocalDatabaseContent(db.members)
    //     await removeAllDatabaseDocs(db.members)

    //     console.log('REFERRER CODE', result, rewards)
    //     // Check if the member was updated

    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with no code', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     // member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('NO CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })


    // // ! Status is not approved
    // it('All fields are approved, with invitation code MLS18', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('BONUS MARKETING CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with referrer code from 132', async ()=> {

    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     let referreMemberResult = await selectMember.execute(132)
    //     let referrerMember = referreMemberResult[0]

    //     referrerMember.approvalState = 2

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerMemberId(132)

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     let members = await getLocalDatabaseContent(db.members)
    //     await removeAllDatabaseDocs(db.members)

    //     console.log('REFERRER CODE', result, rewards)
    //     // Check if the member was updated

    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with no code', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     // member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('NO CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })


    // // ! Description is not approved
    // it('All fields are approved, with invitation code MLS18', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('BONUS MARKETING CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with referrer code from 132', async ()=> {

    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     let referreMemberResult = await selectMember.execute(132)
    //     let referrerMember = referreMemberResult[0]

    //     referrerMember.approvalState = 2

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerMemberId(132)

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     let members = await getLocalDatabaseContent(db.members)
    //     await removeAllDatabaseDocs(db.members)

    //     console.log('REFERRER CODE', result, rewards)
    //     // Check if the member was updated

    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with no code', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     // member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('NO CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })


    // // ! All fields are not approved
    // it('All fields are approved, with invitation code MLS18', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('BONUS MARKETING CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with referrer code from 132', async ()=> {

    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     let referreMemberResult = await selectMember.execute(132)
    //     let referrerMember = referreMemberResult[0]

    //     referrerMember.approvalState = 2

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     member.setReferrerMemberId(132)

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     let members = await getLocalDatabaseContent(db.members)
    //     await removeAllDatabaseDocs(db.members)

    //     console.log('REFERRER CODE', result, rewards)
    //     // Check if the member was updated

    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })

    // it('All fields are approved, with no code', async ()=> {
        
    //     let rewardService = getRewardMemberService()

    //     let answer = new Answer([
    //         { answer: 'yes', field: 'photoVerification' },
    //         { answer: 'yes', field: 'photo1' },
    //         { answer: 'yes', field: 'photo2' },
    //         { answer: 'yes', field: 'photo3' },
    //         { answer: 'yes', field: 'photo4' },
    //         { answer: 'yes', field: 'photo5' },
    //         { answer: 'yes', field: 'statusMessage' },
    //         { answer: 'yes', field: 'longDescription' }
    //     ])

    //     // Get the member with id 131
    //     let memberResult = await selectMember.execute(131)
    //     let member = memberResult[0]

    //     // Modify the member to suit the test
    //     member.approvalState = 1
    //     // member.setReferrerInviteCode('MLS18')

    //     // Run the service
    //     let result = await rewardService.approved(member, answer)

    //     let rewards = await getLocalDatabaseContent(db.rewards)
    //     await removeAllDatabaseDocs(db.rewards)

    //     console.log('NO CODE', result, rewards)
    //     // Check rewards saved in databse
    //     // expect(rewards[0].instantMatch).to.equal(10)
    //     // expect(rewards[0].swipe).to.equal(10)
    //     // expect(rewards[0].premiumDays).to.equal(0)
    //     // expect(rewards[0].memberId).to.equal(131)

    //     // // Asserts
    //     // expect(result.messages).to.be.a('array')
    //     // expect(result.emails).to.be.a('array')
    //     // expect(result.logs).to.be.a('array')
    //     // expect(result.messages.length).to.equal(4)
    //     // expect(result.emails.length).to.equal(1)
    //     // expect(result.logs.length).to.equal(1)
    // })
})

