import {
    IUpdateMemberApprovalCommand,
    ISelectMemberByHashIdQuery,
    IUpdateMemberCommand,
    ISelectMemberApprovalByIdQuery,
    Answer,
    Member,
    Message,
    StaffLogFactory,
    IInsertMessageCommand,
    IUpdateLastMessageBodyCommand,
    IInsertMemberLogCommand,
    IInsertStaffLogCommand
 } from './../../domain'
import { IRewardService } from './RewardService'
import { IPushNotification, ISendEmail, INotification, IWaliApproveLock, IWaliApproveList } from './../Interfaces'
import { ICache } from './../../application'
import { Template } from './../../infrastructure/Cache'


// TODO Extract this in a json file or pull from database
// Admin profile to be sent with XMPP notification
let adminProfile = {
    memberId: 1,
    nickname: 'muzmatch',
    age: 37,
    thumbnail: 'https://cdn.muzmatch.com/profile_images/square/OU1Bb1h3ZG1ib3RscFJqWXN5dGI2KytTNkw0V1VaQjhkMTNlcmRGcjA4bz0=',
    profileSummary: 'Accountant · Sunni · 5ft 8in · Practising · Usually prays',
    professionName: 'Accountant',
    GPSderivedCountryName: 'United Kingdom',
    GPSderivedLocationName: 'London'
}


export default class ApproveMemberService
{
    private _updateMemberApprovalCommand : IUpdateMemberApprovalCommand

    private _selectMemberByHashIdQuery : ISelectMemberByHashIdQuery

    private _waliApproveList : IWaliApproveList

    private _updateMemberCommand : IUpdateMemberCommand

    private _selectMemberApprovalByIdQuery : ISelectMemberApprovalByIdQuery

    private _insertMemberLog : IInsertMemberLogCommand

    private _insertStaffLog : IInsertStaffLogCommand


    private _xmppNotification : INotification

    private _pushNotification : IPushNotification

    private _rewardMember : IRewardService

    private _insertMessageCommand : IInsertMessageCommand

    private _updateLastMessageBodyCommand : IUpdateLastMessageBodyCommand

    private _sendEmail : ISendEmail

    private _cache : ICache

    constructor(
        updateMemberApprovalCommand : IUpdateMemberApprovalCommand,
        selectMemberByHashIdQuery: ISelectMemberByHashIdQuery,
        waliApproveList : IWaliApproveList,
        updateMemberCommand : IUpdateMemberCommand,
        selectMemberApprovalByIdQuery : ISelectMemberApprovalByIdQuery,
        insertMemberLog : IInsertMemberLogCommand,
        insertStaffLog : IInsertStaffLogCommand,
        xmppNotification : INotification,
        snsNotification: IPushNotification,
        rewardMember: IRewardService,
        insertMessageCommand : IInsertMessageCommand,
        updateLastMessageBodyCommand : IUpdateLastMessageBodyCommand,
        sendEmail : ISendEmail,
        cache : ICache,
    ) {
            this._updateMemberApprovalCommand   = updateMemberApprovalCommand
            this._selectMemberByHashIdQuery     = selectMemberByHashIdQuery
            this._waliApproveList               = waliApproveList
            this._updateMemberCommand           = updateMemberCommand
            this._selectMemberApprovalByIdQuery = selectMemberApprovalByIdQuery
            this._insertMemberLog               = insertMemberLog
            this._insertStaffLog                = insertStaffLog
            this._xmppNotification              = xmppNotification
            this._pushNotification              = snsNotification
            this._rewardMember                  = rewardMember
            this._insertMessageCommand          = insertMessageCommand
            this._updateLastMessageBodyCommand  = updateLastMessageBodyCommand
            this._sendEmail                     = sendEmail
            this._cache                         = cache
    }

    async execute(memberHashId: string , answers: { answer: string, field: string }[] , staffId: number)
    {
        let answer = new Answer(answers)

        if(!memberHashId)
        {
            throw Error('Member hash id not provided')
        }

        // 1. Get the member from the id
        let member = await this._selectMemberByHashIdQuery.execute(memberHashId)


        if(!member || !member.id)
        {
            throw Error('Member id is undefined')
        }
        let memberId = member.id

        // 2. Check if Member is Approved or not
        let isApproved = answer.isValid(member)

        // 3. Get member approval report
        let approvalResult = await this._selectMemberApprovalByIdQuery.execute(memberId)
        if(approvalResult.length === 0)
        {
            throw Error('Member doesn\'t have MemberApproval')
        }
        let approval = approvalResult[0]

        // 4.Remove invalid images from member
        member.removeImages(answer.invalidImages())

        // Remove status if rejecred
        if(!answer.validStatus())
        {
            member.setStatus()
        }

        // 5. Increment the number of attempts to validate the member profile
        approval.setAttempts(approval.attempts + 1)

        member.setProfileReviewedByAdmin(1)
        member.setApproved(isApproved ? 1 : 0)

        // 6. Setup the Member Approval object
        approval = answer.updateApprovalReport(approval)

        // 7. Update the Member and the Member Approval report
        await this._updateMemberApprovalCommand.execute(approval)
        await this._updateMemberCommand.execute(member)

        // Remove from wali approve list
        await this._waliApproveList.remove(memberId)

        // 8. Trigger an event based on the state of member approval for staff and insert it
        let eventCode = isApproved ? 'PROFILE_APPROVED' : 'PROFILE_NOT_APPROVED'
        let action    = this.createEventAction(member.complete, answer.getAllFields())

        let staffLog = StaffLogFactory.build({
            staffId: staffId,
            memberId: memberId,
            eventCode: eventCode,
            action: action
        })

        await this._insertStaffLog.execute(staffLog)

        if(!member.hashId)
        {
            throw Error('Cannot send user notification. Member is missing hash id')
        }

        // 9. if member is approved/rejected sent them approved/rejected messages
        let notifications = await this._rewardMember.execute(member, answer)

        // 10. Send the SNS Push Notifications
        for(let index = 0; index < notifications.messages.length; index++)
        {
            // send messages if Push or XMPP
            let message = notifications.messages[index]

            if (message.shouldSendPushNotification()) {
                // send Push
                await this._pushNotification.execute({
                    matchId : message.matchId,
                    memberId: message.memberId
                }, member.deviceOS, member.AWSendpointARN, 'ADMIN_MESSAGE', message.body)
            }
        }

        // Send XMPP
        this.saveMessagesAndSendXMPP(notifications.messages, member, memberId.toString() )


        // 12. Send Emails
        for(let index = 0; index < notifications.emails.length; index++)
        {
            let emailResult = await this._sendEmail.execute(
                notifications.emails[index].toEmail,
                notifications.emails[index].from,
                notifications.emails[index].subject,
                notifications.emails[index].body
            )
        }


        // 13. Insert member logs
        if(notifications.logs.length > 0)
        {
            for(let index = 0; index < notifications.logs.length; index++)
            {
                await this._insertMemberLog.execute(notifications.logs[index])
            }
        }


        // Return true or false if member profile was approved
        return isApproved
    }

    private createEventAction(complete : number, fields : string[])
    {
        return `profileCreated=${ complete } fields=${ fields.join(',') }`
    }


    private async saveMessagesAndSendXMPP(messages: Message[], member : Member, memberId : string)
    {
        // First, save the message in the database
        for(let index = 0; index < messages.length; index++)
        {
            await this._insertMessageCommand.execute(messages[index])

            if(index === messages.length - 1)
            {
                await this._updateLastMessageBodyCommand.execute(
                    messages[index].body,
                    messages[index].senderMemberId,
                    messages[index].matchId
                )
            }
            this._cache.remove(Template.generate('MATCH', { ID : messages[index].matchId}))
            this.updateNewMessageCache(memberId, messages[index].senderMemberId.toString())
            this.updateNewMessageCache(messages[index].senderMemberId.toString(), memberId)
        }

        // Now send the XMPP messages
        this._xmppNotification.send(messages, member, adminProfile)
    }

    private async updateNewMessageCache(memberId : string, valueToUpdate : string) {

        let existingMatchesKeys = Template.generate('MATCHES_EXISTING', {ID: memberId})
        let allMatchesKeys = Template.generate('MATCHES_ALL', {ID: memberId})
        let newMatchesKeys = Template.generate('MATCHES_NEW', {ID: memberId})

        let addToMySets = [
            existingMatchesKeys,
            allMatchesKeys
        ]

        let removeFromMySets = [
            newMatchesKeys
        ]

        let existingKeys = await this.existingKeys(addToMySets)

        try {
            this._cache.transaction()

            addToMySets.map(async (set, index) => {
                if(existingKeys[index]) {
                    this._cache.addToSet(set, valueToUpdate)
                }
            })

            this._cache.execute()

        } catch(err) {

            console.log(err)
            this._cache.discard()
        }

        existingKeys = await this.existingKeys(removeFromMySets)

        try {
            this._cache.transaction()

            removeFromMySets.map(async (set, index) => {

                if(existingKeys[index]) {
                    this._cache.removeFromSet(set, valueToUpdate)
                }
            })

            this._cache.execute()

        } catch(err) {

            console.log(err)
            this._cache.discard()
        }
    }

    private async existingKeys(keys : string[]) {

        let existingKeys = []

        for (let i = 0; i < keys.length; i++) {
            existingKeys.push(await this._cache.exists(keys[i]))
        }
        return existingKeys
    }

}
