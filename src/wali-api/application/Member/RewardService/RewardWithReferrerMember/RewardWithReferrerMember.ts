import { 
    Member,
    Message,
    MessageFactory, 
    Email,
    EmailFactory,
    MemberLog,
    MemberLogFactory,

    IUpdateMemberCommand,
    ISelectMemberByIdQuery,
    ISelectInviteCodeQuery,
    ISelectMatchIdQuery } from './../../../../domain'
import { ILocale } from './../../../../application'
import { IBuildRewardFromInviteCode } from './../BuildRewardFromInviteCode'



export default class RewardWithReferrerMember
{
    private _updateMember : IUpdateMemberCommand

    private _selectMember : ISelectMemberByIdQuery

    private _selectMatch : ISelectMatchIdQuery

    private _selectInviteCode : ISelectInviteCodeQuery

    private _locale : ILocale

    private _buildReward : IBuildRewardFromInviteCode


    constructor(
        updateMember : IUpdateMemberCommand,
        selectMember : ISelectMemberByIdQuery,
        selectMatch : ISelectMatchIdQuery,
        selectInviteCode : ISelectInviteCodeQuery,
        locale : ILocale,
        buildReward : IBuildRewardFromInviteCode
    ){
        this._updateMember     = updateMember
        this._selectMember     = selectMember
        this._selectMatch      = selectMatch
        this._selectInviteCode = selectInviteCode
        this._locale           = locale
        this._buildReward      = buildReward
    }

    async execute(member : Member)
    {
        let messages : Message[] = []
        let emails : Email[] = []
        let logs : MemberLog[] = []
        
        if(!member.id)
        {
            throw new Error('Member id is undefined')
        }

        if(!member.hashId)
        {
            throw new Error('Member hash id is undefined')
        }

        if(!member.emailAddress)
        {
            throw new Error('Member email address is undefined')
        }

        // Set member locale
        let memberLang = this._locale.isValidOrDefault(member.locale)

        // Get the referrer member
        let referrerMember = await this.getReferrerMember(member)
        if(!referrerMember)
        {
            throw Error('Member does not have a referrer member')
        }

        if(!referrerMember.id)
        {
            throw Error('Referrer member id is undefined')
        }

        if(!referrerMember.hashId)
        {
            throw Error('Referrer member hash id is undefined')
        }

        // Get the match id between the member and admin, referrer member and admin
        let memberMatch   = await this.getAdminMatchId(member.id)
        let referrerMatch = await this.getAdminMatchId(referrerMember.id)

        // Get the invite code for referre from database
        let inviteCodeResult = await this._selectInviteCode.execute('MEMBER-REFERRER')
        let inviteCode = inviteCodeResult[0]
        if(!inviteCode)
        {
            throw Error('Invite code was not found')
        }

        // Build rewards from invite codes
        let rewardMessageBody = await this._buildReward.execute(referrerMember, inviteCode)
        
        // Increment the number of instant match on the member
        member.instantMatchCredit = member.instantMatchCredit + 1
        await this._updateMember.execute(member)

        // Log event for referrer member
        logs.push(
            MemberLogFactory.build({
                memberId: member.id, 
                eventCode: 'INVITED_MEMBER_CREDITS_EARNED', 
                action: `Gave referrerMember ${ referrerMember.id } credits`}
            )
        )
        
        // Log event for member
        logs.push(
            MemberLogFactory.build({
                memberId: referrerMember.id, 
                eventCode: 'INVITED_MEMBER_CREDITS_EARNED', 
                action: `Earned credits from ${ member.id } approval`}
            )
        )

        messages.push(
            MessageFactory.build({
                memberId: member.id,
                memberHashId: member.hashId,
                matchId: memberMatch,
                senderMemberId: 1,
                body: await this._locale.key('EN', 'WALI_REWARDS_WITHOUTREFERRER_MESSAGE'),
                messageType: 'T',
                sendXmpp: false,
                sendPush: false
            })
        )

        messages.push(
            MessageFactory.build({
                memberId: member.id,
                memberHashId: member.hashId,
                matchId: memberMatch,
                senderMemberId: 1,
                body: await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_BECAUSE_YOU'),
                messageType: 'T',
                sendXmpp: false,
                sendPush: false
            })
        )
        
        // Send messages for referrer member
        messages.push(
            MessageFactory.build({
                memberId: referrerMember.id,
                memberHashId: referrerMember.hashId,
                matchId: referrerMatch,
                senderMemberId: 1,
                body: await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_INVITED'),
                messageType: 'A',
                sendXmpp: false,
                sendPush: false
            })
        )

        messages.push(
            MessageFactory.build({
                memberId: referrerMember.id,
                memberHashId: referrerMember.hashId,
                matchId: referrerMatch,
                senderMemberId: 1,
                body: await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_BECAUSE_THEY'),
                messageType: 'T',
                sendXmpp: false,
                sendPush: false
            })
        )

        // !Send reward message - The order may not be the right one
        if(rewardMessageBody)
        {
            messages.push(
                MessageFactory.build({
                    memberId: referrerMember.id,
                    memberHashId: referrerMember.hashId,
                    matchId: memberMatch,
                    senderMemberId: 1,
                    body: rewardMessageBody,
                    messageType: 'T',
                    sendXmpp: false,
                    sendPush: false
                })
            )
        }

        messages.push(
            MessageFactory.build({
                memberId: referrerMember.id,
                memberHashId: referrerMember.hashId,
                matchId: referrerMatch,
                senderMemberId: 1,
                body: await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_SHARE_AGAIN'),
                messageType: 'T',
                sendXmpp: false,
                sendPush: false
            })
        )

        // Send different email if member is active or not
        let subjectKey = (member.activeProfile === 1) ? 'WALI_APPROVED_PROFILE' : 'WALI_APPROVED_INACTIVE_EMAIL_SUBJECT'
        let bodyKey    = (member.activeProfile === 1) ? 'WALI_REWARDS_WITHOUTREFERRER_ACTIVE_EMAIL' : 'WALI_REWARDS_WITHOUTREFERRER_INACTIVE_EMAIL'

        emails.push(
            EmailFactory.build({
                toEmail: member.emailAddress,
                from: 'support@muzmatch.com',
                subject: await this._locale.key(memberLang, subjectKey),
                body: await this._locale.key(memberLang, bodyKey)
            })
        )

        if(referrerMember.emailAddress)
        {        
            let referrerLang = this._locale.isValidOrDefault(referrerMember.locale)
            emails.push(
                EmailFactory.build({
                    toEmail: referrerMember.emailAddress,
                    from: 'support@muzmatch.com',
                    subject: await this._locale.key(referrerLang, 'WALI_REWARDS_REFERRERMEMBER_REFERRER_EMAIL_SUBJECT'),
                    body: await this._locale.key(referrerLang, 'WALI_REWARDS_REFERRERMEMBER_REFERRER_EMAIL_BODY')
                })
            )
        }

        return {
            messages: messages,
            emails: emails,
            logs: logs
        }
    }

    private async getReferrerMember(member : Member) : Promise<Member | null>
    {
        if(!member.referrerMemberId)
        {
            throw Error('Missing referrer member id')
        }
        let memberResult = await this._selectMember.execute(member.referrerMemberId)

        if(!memberResult)
        {
            throw Error('Member not found')
        }
        let referrerMember = memberResult[0]

        // Check if the member and referrerMember is not actually the same person with 2 accounts
        if(!member.isValidReferrer(referrerMember))
        {
            return null
        }
        return referrerMember
    }

    private async getAdminMatchId(memberId : number) : Promise<number>
    {
        let match = await this._selectMatch.execute(memberId, 1)
        if(!match || !match.id)
        {
            throw Error('Match not found')
        }
        return match.id
    }
}