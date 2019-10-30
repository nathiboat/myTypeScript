import {
    Member,
    MessageFactory,
    Message,
    Answer,
    MemberLog,
    MemberLogFactory,

    Email,
    EmailFactory,

    InviteCode,
    ISelectMemberByIdQuery,
    IUpdateMemberCommand,
    ISelectInviteCodeQuery,
    ISelectMatchIdQuery,
    IUpdateMemberRewardTransaction } from './../../domain'
import { ILocale } from './../../application'
import { MemberNotFoundException } from './../Exceptions'


export default class RewardMemberService
{
    private _selectMember : ISelectMemberByIdQuery

    private _updateMember : IUpdateMemberCommand

    private _selectInviteCode : ISelectInviteCodeQuery

    private _selectMatch : ISelectMatchIdQuery

    private _updateRewardTransaction : IUpdateMemberRewardTransaction

    private _locale : ILocale


    private _memberLogs : MemberLog[] = []

    private _messages : Message[] = []

    private _emails : Email[] = []


    private _memberId! : number

    private _memberHashId! : string

    private _memberLocale! : string

    private _matchId! : number

    private _memberEmail! : string

    constructor(
        selectMember : ISelectMemberByIdQuery,
        updateMember : IUpdateMemberCommand,
        selectInviteCode : ISelectInviteCodeQuery,
        selectMatch : ISelectMatchIdQuery,
        updateRewardTransaction : IUpdateMemberRewardTransaction,
        locale: ILocale
    ){
        this._selectMember            = selectMember
        this._updateMember            = updateMember
        this._selectInviteCode        = selectInviteCode
        this._selectMatch             = selectMatch
        this._updateRewardTransaction = updateRewardTransaction
        this._locale                  = locale
    }

    private async init(member : Member)
    {
        if(!member.id)
        {
            throw Error('Member does not have an id')
        }

        
        if(!member.emailAddress)
        {
            throw Error('Member does not have an email address')
        }

        if(!member.hashId)
        {
            throw Error('Member does not have a hash id')
        }
        this._memberId     = member.id
        this._memberHashId = member.hashId
        this._memberLocale = this._locale.isValidOrDefault(member.locale)
        this._matchId      = await this.getAdminMatchId(member.id)
        this._memberEmail  = member.emailAddress
    }

    async execute(member : Member, answer : Answer)
    {
        if(answer.isValid(member))
        {
            return await this.approved(member, answer)
        }
        return await this.rejected(member, answer)
    }

    async approved(member : Member, answer : Answer)
    {
        // Init the object
        await this.init(member)

        if(member.complete === 2 && member.approvalState < 2)
        {
            // If this is the first time being approved, at the final approval state
            member.approvalState = 2
            await this._updateMember.execute(member)

            this.buildAdminMessage(await this._locale.key('EN', 'WALI_APPROVED_PROFILE'), 'A')

            this.buildAdminMessage(
                await this._locale.key('EN', 'WALI_APPROVED_BY_TEAM'),
                "T",
                this._memberHashId,
                true,
                true
            )

            // Check what type of rewards should this user get
            if(member.referrerMemberId)
            {   
                // This happens when you sign up with another member referrer code
                await this.rewardFromMemberReferrer(member, member.referrerMemberId)

            } else if(member.referrerInviteCode) {
        
                await this.rewardFromInviteCode(member, member.referrerInviteCode)

            } else {

                await this.rewardDefault(member)

            }

        } else {
            // Find out if this a repeat approval or a first time approval

            if(member.approvalState < 2)
            {
                member.approvalState = member.complete
                await this._updateMember.execute(member)
            }

            this.buildAdminMessage(
                await this._locale.key('EN', 'WALI_APPROVED_PROFILE'),
                "A",
                this._memberHashId,
                true,
                true
            )

            // Send different email if member is active or not
            let subjectKey = (member.activeProfile === 1) ? 'WALI_APPROVED_PROFILE' : 'WALI_APPROVED_INACTIVE_EMAIL_SUBJECT'
            let bodyKey    = (member.activeProfile === 1) ? 'WALI_APPROVED_ACTIVE_EMAIL_BODY' : 'WALI_APPROVED_INACTIVE_EMAIL_BODY'

            this.buildEmail(
                this._memberEmail,
                await this._locale.key(this._locale.isValidOrDefault(member.locale), subjectKey),
                await this._locale.key(this._locale.isValidOrDefault(member.locale), bodyKey)
            )
        }

        // Send message back on why your profile was not approved ( if it deleted some images from your account)
        // Send a message to the member with the reasons why he weas rejected
        this.buildAdminMessage(
            await this.buildRejectResponseMessageBody(member, answer),
            "T",
            this._memberHashId,
            true,
            true
        )

        return {
            emails: this._emails,
            messages: this._messages,
            logs: this._memberLogs
        }
    }

    async rejected(member : Member, answer : Answer)
    {
        // Init the object
        await this.init(member)

        // Get the match id between the current member and admin
        // let matchId = await this.getAdminMatchId(this._memberId)

        this.buildEmail(
            this._memberEmail,
            await this._locale.key(this._locale.isValidOrDefault(member.locale), 'WALI_REJECTED_EMAIL_SUBJECT'),
            await this.buildRejectResponseEmailBody(member, answer)
        )

        this.buildAdminMessage(
            await this._locale.key( this._locale.isValidOrDefault(member.locale), 'WALI_REJECTED_PROFILE'),
            "A",
            this._memberHashId,
            true,
            true
        )

        // Send a message to the member with the reasons why he weas rejected
        this.buildAdminMessage(
            await this.buildRejectResponseMessageBody(member, answer),
            "T",
            this._memberHashId,
            true,
            true
        )

        // Return emails and messages
        return {
            emails: this._emails,
            messages: this._messages,
            logs: this._memberLogs
        }

    }

    // Messages that must be sent
    // WALI_REWARDS_WITHOUTREFERRER_MESSAGE
    // WALI_REWARDS_REFERRERMEMBER_BECAUSE_YOU
    // WALI_REWARDS_REFERRERMEMBER_INVITED
    // WALI_REWARDS_REFERRERMEMBER_BECAUSE_THEY
    // WALI_REWARDS_REFERRERMEMBER_SHARE_AGAIN

    // Events that must be logged
    // INVITED_MEMBER_CREDITS_EARNED
    // INVITED_MEMBER_CREDITS_EARNED

    // !DONE
    private async rewardFromMemberReferrer(member : Member, referrerMemberId : number)
    {
        let valid = await this.isValidReferrer(member)
        if(!valid)
        {
            throw Error('Member is not valid')
        }

        // Check if referrer member has valid id
        let referrerMember = await this.getReferrerMember(member)
        if(!referrerMember.id)
        {
            throw Error('Referrer member does not have an id')
        }

        if(!referrerMember.hashId)
        {
            throw Error('Referrer member does not have a hash id')
        }

        // Get the invite code from database
        let inviteCodeResult = await this._selectInviteCode.execute('MEMBER-REFERRER')
        let inviteCode = inviteCodeResult[0]
        if(!inviteCode)
        {
            throw Error('Invite code was not found')
        }

        // Build rewards from invite codes
        this.buildRewardsFromInviteCode(member, inviteCode)


        // Increment the number of instant match on the member
        member.instantMatchCredit = member.instantMatchCredit + 1
        await this._updateMember.execute(member)

        // Trigger events to notify that both members received rewards
        this._memberLogs.push(MemberLogFactory.build({
            memberId: this._memberId, 
            eventCode: 'INVITED_MEMBER_CREDITS_EARNED', 
            action: `Gave referrerMember ${ referrerMember.id } credits`})
        )

        this._memberLogs.push(MemberLogFactory.build({
            memberId: referrerMember.id, 
            eventCode: 'INVITED_MEMBER_CREDITS_EARNED', 
            action: `Earned credits from ${ member.id } approval`})
        )

        // Send messages and emails to both of the members
        this.buildAdminMessage(await this._locale.key('EN', 'WALI_REWARDS_WITHOUTREFERRER_MESSAGE'))

        this.buildAdminMessage(await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_BECAUSE_YOU'))
        
        // TODO Referer member hash 
        this.buildAdminMessage(
            await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_INVITED'), 
            'A',
            referrerMember.hashId
        )
        
        // TODO Referer member hash 
        this.buildAdminMessage(
            await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_BECAUSE_THEY'),
            'T',
            referrerMember.hashId
        )

        // TODO Referer member hash
        this.buildAdminMessage(
            await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_SHARE_AGAIN'),
            'T',
            referrerMember.hashId
        )

        // Send different email if member is active or not
        let subjectKey = (member.activeProfile === 1) ? 'WALI_APPROVED_PROFILE' : 'WALI_APPROVED_INACTIVE_EMAIL_SUBJECT'
        let bodyKey    = (member.activeProfile === 1) ? 'WALI_REWARDS_WITHOUTREFERRER_ACTIVE_EMAIL' : 'WALI_REWARDS_WITHOUTREFERRER_INACTIVE_EMAIL'

        this.buildEmail(
            this._memberEmail,
            await this._locale.key(this._memberLocale, subjectKey),
            await this._locale.key(this._memberLocale, bodyKey)
        )

        if(referrerMember.emailAddress)
        {
            this.buildEmail(
                this._memberEmail,
                await this._locale.key(this._locale.isValidOrDefault(referrerMember.locale), 'WALI_REWARDS_REFERRERMEMBER_REFERRER_EMAIL_SUBJECT'),
                await this._locale.key(this._locale.isValidOrDefault(referrerMember.locale), 'WALI_REWARDS_REFERRERMEMBER_REFERRER_EMAIL_BODY')
            )
        }
    } 

    // !DONE
    // Messages to be sent
    // WALI_REWARDS_REFERRERCODE_BECAUSE_YOU
    // WALI_REWARDS_REFERRERMEMBER_YOU_SHARE - KEY not in json

    // Emails to be sent
    // WALI_APPROVED_PROFILE + WALI_REWARDS_REFERRERCODE_ACTIVE_EMAIL
    // WALI_APPROVED_INACTIVE_EMAIL_SUBJECT + WALI_REWARDS_REFERRERCODE_INACTIVE_EMAIL
    private async rewardFromInviteCode(member : Member, referrerInviteCode : string)
    {
        // Get the current invite code from database
        let inviteCodeResult = await this._selectInviteCode.execute(referrerInviteCode)
        let inviteCode = inviteCodeResult[0]

        if(!inviteCode)
        {
            throw Error('Invite code was not found')
        }

        // Build rewards from invite codes
        await this.buildRewardsFromInviteCode(member, inviteCode)

        // Trigger event
        this._memberLogs.push(MemberLogFactory.build({
            memberId: this._memberId, 
            eventCode: 'INVITED_MEMBER_CREDITS_EARNED', 
            action: `Earned credits from code: ${ member.referrerInviteCode }`})
        )

        // Send messages and emails to member
        // this.buildAdminMessage(await this._locale.key('EN', 'WALI_REWARDS_REFERRERCODE_BECAUSE_YOU'))

        // this.buildAdminMessage(await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_YOU_SHARE')) - Key not in json array

        // Send different email if member is active or not
        let subjectKey = (member.activeProfile === 1) ? 'WALI_APPROVED_PROFILE' : 'WALI_APPROVED_INACTIVE_EMAIL_SUBJECT'
        let bodyKey    = (member.activeProfile === 1) ? 'WALI_REWARDS_REFERRERCODE_ACTIVE_EMAIL' : 'WALI_REWARDS_REFERRERCODE_INACTIVE_EMAIL'

        this.buildEmail(
            this._memberEmail,
            await this._locale.key(this._memberLocale, subjectKey),
            await this._locale.key(this._memberLocale, bodyKey)
        )
    }

    // !DONE
    // Messages to be sent
    // WALI_REWARDS_WITHOUTREFERRER_MESSAGE

    // Emails to be sent
    // WALI_APPROVED_PROFILE + WALI_REWARDS_WITHOUTREFERRER_ACTIVE_EMAIL
    // WALI_APPROVED_INACTIVE_EMAIL_SUBJECT + WALI_REWARDS_WITHOUTREFERRER_INACTIVE_EMAIL
    private async rewardDefault(member : Member)
    {
        if(!member.emailAddress)
        {
            throw Error('Member does not have email address')
        }

        // Increment the number of instant match on the member
        member.instantMatchCredit = member.instantMatchCredit + 1
        await this._updateMember.execute(member)

        this.buildAdminMessage(await this._locale.key('EN', 'WALI_REWARDS_WITHOUTREFERRER_MESSAGE'))

        // Send email to the member
        let subjectKey = (member.activeProfile === 1) ? 'WALI_APPROVED_PROFILE' : 'WALI_APPROVED_INACTIVE_EMAIL_SUBJECT'
        let bodyKey    = (member.activeProfile === 1) ? 'WALI_REWARDS_WITHOUTREFERRER_ACTIVE_EMAIL' : 'WALI_REWARDS_WITHOUTREFERRER_INACTIVE_EMAIL'

        this.buildEmail(
            member.emailAddress,
            await this._locale.key(this._locale.isValidOrDefault(member.locale), subjectKey),
            await this._locale.key(this._locale.isValidOrDefault(member.locale), bodyKey)
        )
    }

    private async buildRejectResponseEmailBody(member : Member, answer : Answer)
    {
        let emailBody : string[] = []
        emailBody.push(
            await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                member.activeProfile === 1 ? 'WALI_REJECTED_PROFILE_NEEDS_WORK' : 'WALI_REJECTED_PROFILE_INACTIVE_NEEDS_WORK'
            )
        )

        // This needs to be abstracted in a Facade
        // If photo verification is rejected
        if(!answer.validVerificationPhoto())
        {
            emailBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTOVERIFICATION') }`)
        }

        // If photo 1 is rejected
        if(!answer.validFirstPhoto())
        {
            if(member.gender === 'M')
            {
                emailBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTO1_M') }`)
            } else {
                emailBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTO1_F') }`)
            }
        }

        // If one or more images from photo2 ... photo5 is rejected
        if(answer.invalidImagesExcludingFirst().length < 2)
        {
            emailBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTON_1') }`)
        } else {
            emailBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTON_N') }`)
        }

        // If long description is rejected
        if(!answer.validDescription())
        {
            emailBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_LONGDESCRIPTION') }`)
        }

        emailBody.push(
            await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                'EMAIL_SEE_YOU_BACK_SOON'
            )
        )

        return emailBody.join('\n\n')
    }

    // !DONE
    private async buildRejectResponseMessageBody(member : Member, answer : Answer)
    {
        let messageBody : string[] = []
        messageBody.push(
            await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                'WALI_REJECTED_PROFILE_NEEDS_WORK'
            )
        )

        // This needs to be abstracted
        // If photo verification is rejected
        if(!answer.validVerificationPhoto())
        {
            messageBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTOVERIFICATION') }`)
        }

        // If photo 1 is rejected
        if(!answer.validFirstPhoto())
        {
            if(member.gender === 'M')
            {
                messageBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTO1_M') }`)
            } else {
                messageBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTO1_F') }`)
            }
        }

        // If one or more images from photo2 ... photo5 is rejected
        if(answer.invalidImagesExcludingFirst().length < 2)
        {
            messageBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTON_1') }`)
        } else {
            messageBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_PHOTON_N') }`)
        }

        // If long description is rejected
        if(!answer.validDescription())
        {
            messageBody.push(`• ${ await this._locale.key(this._memberLocale, 'WALI_REJECT_LONGDESCRIPTION') }`)
        }

        // Insert the reasons why message was declined
        return messageBody.join('\n')
    }

    // !DONE
    private async isValidReferrer(member : Member)
    {
        if(!member.referrerMemberId)
        {
            throw Error('Missing referrer member id')
        }
        let memberResult = await this._selectMember.execute(member.referrerMemberId)

        if(!memberResult)
        {
            throw new MemberNotFoundException('RewardMemberService')
        }
        let referrerMember = memberResult[0]

        // Check if the member and referrerMember is not actually the same person with 2 accounts
        return member.isValidReferrer(referrerMember)
    }

    // !DONE
    private async getReferrerMember(member : Member)
    {
        if(!member.referrerMemberId)
        {
            throw Error('Member does not have any referrer member id')
        }
        let memberResult = await this._selectMember.execute(member.referrerMemberId)
        return memberResult[0]
    }

    // !DONE
    // Get the match id beween the member and admin
    private async getAdminMatchId(memberId : number) : Promise<number>
    {
        let match = await this._selectMatch.execute(memberId, 1)
        if(!match.id)
        {
            throw Error('Match not found')
        }
        return match.id
    }

    // !DONE
    // Build a message send by admin to a member
    private buildAdminMessage(
        body : string,
        messageType? : string,
        memberHashId? : string,
        sendXmpp? : boolean,
        sendPush? : boolean) : void
    {
        this._messages.push(
            MessageFactory.build({
                memberId: this._memberId,
                memberHashId: memberHashId || this._memberHashId,
                matchId: this._matchId,
                senderMemberId: 1,
                body: body,
                messageType: messageType || 'T',
                sendXmpp: sendXmpp,
                sendPush: sendPush
            })
        )
    }

    // !DONE
    private buildEmail(email : string, subject : string, body : string) : void
    {
        this._emails.push(EmailFactory.build({
                toEmail: email,
                from: 'support@muzmatch.com',
                subject: subject,
                body: body
            })
        )
    }

    // !DONE
    private async buildRewardsFromInviteCode(member : Member, inviteCode : InviteCode)
    {
        let messageBody : string[] = []

        // If inviteCode offers "premium for days" but user is already premium
        if(inviteCode.premiumForDays && member.premium === 1)
        {
            // set premium for days as undefined
            inviteCode.removePremiumForDays()

            // set extra swipes as fallback extra swipes or just remove
            !inviteCode.extraSwipes ? inviteCode.setExtraSwipes(inviteCode.fallbackExtraSwipes) : inviteCode.removeExtraSwipes()

            // set instant matches as fallback instant matches or remove
            !inviteCode.instantMatches ? inviteCode.setInstantMatches(inviteCode.fallbackInstantMatches) : inviteCode.removeInstantMatches()
        }

        // if inviteCode has premium for days and user is not premium
        if(inviteCode.premiumForDays && member.premium === 0)
        {
            let text = await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                'WALI_REWARDS_DAYS_OF_PREMIUM',
                { premiumForDays : inviteCode.premiumForDays }
            )
            messageBody.push(
                `- ${ text }`
            )

            // Add to the transaction
            this._updateRewardTransaction.setMemberPremiumForDays(member.id!, inviteCode.premiumForDays)
        }

        // if inviteCode does not offer extra swipes
        if(inviteCode.extraSwipes)
        {
            let text = await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                'WALI_REWARDS_EXTRA_SWIPES',
                { d : inviteCode.extraSwipes }
            )
            messageBody.push(
                `- ${ text }`
            )

            // Add to the transaction
            this._updateRewardTransaction.setMemberSwipeAllocation(member.id!, inviteCode.extraSwipes)
        }

        // if inviteCode does not offer instant matches
        if(inviteCode.instantMatches)
        {
            let text = await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                'WALI_REWARDS_INSTANT_MATCHES',
                { d : inviteCode.instantMatches }
            )
            messageBody.push(
                `- ${ text }`
            )

            // Add to the transaction
            this._updateRewardTransaction.setMemberInstantMatches(member.id!, inviteCode.instantMatches)
        }

        // Run the transaction in a try catch block
        try {
            await this._updateRewardTransaction.execute()
        } catch(error) {
            throw error
        }

        if(messageBody.length > 0)
        {
            messageBody.unshift(
                await this._locale.key('EN', 'WALI_REWARDS_REFERRERCODE_BECAUSE_YOU')
            )
            // Put all the messages from the build rewards from invite code, in the messages queue
            this.buildAdminMessage(messageBody.join(' \n '))
        }
    }
}
