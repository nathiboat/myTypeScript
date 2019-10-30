import { IRewardWithReferrerMember } from './RewardWithReferrerMember'
import { IRewardFromInviteCode } from './RewardFromInviteCode'
import { IRewardDefault } from './RewardDefault'
import { IBuildRejectBody } from './BuildRejectMessageBody'
import { 
    Member, 
    Answer, 
    Message, 
    MessageFactory, 
    Email, 
    EmailFactory, 
    MemberLog,  
    IUpdateMemberCommand, 
    ISelectMatchIdQuery } from './../../../domain'
import { ILocale } from './../../../application'



export default class RewardService
{
    private _rewardWithReferrer : IRewardWithReferrerMember

    private _rewardFromInviteCode : IRewardFromInviteCode

    private _rewardDefault : IRewardDefault

    private _buildRejectMessage : IBuildRejectBody

    private _buildRejectEmail : IBuildRejectBody


    private _updateMember : IUpdateMemberCommand

    private _selectMatch : ISelectMatchIdQuery

    private _locale : ILocale

    constructor(
        rewardWithReferrer : IRewardWithReferrerMember, 
        rewardFromInviteCode : IRewardFromInviteCode, 
        rewardDefault : IRewardDefault,
        buildRejectMessage : IBuildRejectBody,
        buildRejectEmail : IBuildRejectBody,
        updateMember : IUpdateMemberCommand,
        selectMatch : ISelectMatchIdQuery,
        locale : ILocale
    ) {
        this._rewardWithReferrer   = rewardWithReferrer
        this._rewardFromInviteCode = rewardFromInviteCode
        this._rewardDefault        = rewardDefault
        this._buildRejectMessage   = buildRejectMessage
        this._buildRejectEmail     = buildRejectEmail

        this._updateMember = updateMember
        this._selectMatch  = selectMatch
        this._locale       = locale
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
        let messages : Message[] = []
        let emails : Email[] = []
        let logs : MemberLog[] = []

        // Check if member is valid
        if(!member.id)
        {
            throw Error('Member id is undefined')
        }

        if(!member.emailAddress)
        {
            throw Error('Member email is undefined')
        }

        // Get the member language
        let memberLang = this._locale.isValidOrDefault(member.locale)

        // Get member match with admin
        let memberMatchId = await this.getAdminMatchId(member.id)

        if(member.complete === 2 && member.approvalState < 2)
        {
            // If this is the first time being approved, at the final approval state
            member.approvalState = 2
            await this._updateMember.execute(member)

            // this.buildAdminMessage(await this._locale.key('EN', 'WALI_APPROVED_PROFILE'), 'A')

            messages.push(
                MessageFactory.build({
                    memberId: member.id,
                    memberHashId: member.hashId,
                    matchId: memberMatchId,
                    senderMemberId: 1,
                    body: await this._locale.key('EN', 'WALI_APPROVED_PROFILE'),
                    messageType: 'A',
                    sendXmpp: false,
                    sendPush: false
                })
            )


            // this.buildAdminMessage(
            //     await this._locale.key('EN', 'WALI_APPROVED_BY_TEAM'),
            //     "T",
            //     this._memberHashId,
            //     true,
            //     true
            // )

            messages.push(
                MessageFactory.build({
                    memberId: member.id,
                    memberHashId: member.hashId,
                    matchId: memberMatchId,
                    senderMemberId: 1,
                    body: await this._locale.key('EN', 'WALI_APPROVED_BY_TEAM'),
                    messageType: 'T',
                    sendXmpp: false,
                    sendPush: false
                })
            )
            
            let result : { messages: Message[], emails: Email[], logs: MemberLog[] }
            // Check what type of rewards should this user get

            if(member.referrerMemberId)
            {   
                result = await this._rewardWithReferrer.execute(member)

            } else if(member.referrerInviteCode) {
        
                result = await this._rewardFromInviteCode.execute(member, member.referrerInviteCode)
            
            } else {

                result = await this._rewardDefault.execute(member)
    
            }

            messages = messages.concat(result.messages)
            emails   = emails.concat(result.emails)
            logs     = logs.concat(result.logs)

        } else {
            // Find out if this a repeat approval or a first time approval

            if(member.approvalState < 2)
            {
                member.approvalState = member.complete
                await this._updateMember.execute(member)
            }

            // this.buildAdminMessage(
            //     await this._locale.key('EN', 'WALI_APPROVED_PROFILE'),
            //     "A",
            //     this._memberHashId,
            //     true,
            //     true
            // )

            messages.push(
                MessageFactory.build({
                    memberId: member.id,
                    memberHashId: member.hashId,
                    matchId: memberMatchId,
                    senderMemberId: 1,
                    body: await this._locale.key('EN', 'WALI_APPROVED_PROFILE'),
                    messageType: 'A',
                    sendXmpp: true,
                    sendPush: true
                })
            )

            // Send different email if member is active or not
            let subjectKey = (member.activeProfile === 1) ? 'WALI_APPROVED_PROFILE' : 'WALI_APPROVED_INACTIVE_EMAIL_SUBJECT'
            let bodyKey    = (member.activeProfile === 1) ? 'WALI_APPROVED_ACTIVE_EMAIL_BODY' : 'WALI_APPROVED_INACTIVE_EMAIL_BODY'

            // this.buildEmail(
            //     this._memberEmail,
            //     await this._locale.key(this._locale.isValidOrDefault(member.locale), subjectKey),
            //     await this._locale.key(this._locale.isValidOrDefault(member.locale), bodyKey)
            // )
            emails.push(
                EmailFactory.build({
                    toEmail: member.emailAddress,
                    from: 'support@muzmatch.com',
                    subject: await this._locale.key(memberLang, subjectKey),
                    body: await this._locale.key(memberLang, bodyKey)
                })
            )
        }

        // Send message back on why your profile was not approved ( if it deleted some images from your account)
        // Send a message to the member with the reasons why he weas rejected
        // this.buildAdminMessage(
        //     await this.buildRejectResponseMessageBody(member, answer),
        //     "T",
        //     this._memberHashId,
        //     true,
        //     true
        // )
        if(answer.invalidImages().length > 0 || answer.validStatus() === false)
        {
            messages.push(
                MessageFactory.build({
                    memberId: member.id,
                    memberHashId: member.hashId,
                    matchId: memberMatchId,
                    senderMemberId: 1,
                    body: await this._buildRejectMessage.execute(member, answer),
                    messageType: 'T',
                    sendXmpp: true,
                    sendPush: true
                })
            )
        }

        return {
            emails,
            messages,
            logs
        }
    }

    async rejected(member : Member, answer : Answer)
    {
        let messages : Message[] = []
        let emails : Email[] = []
        let logs : MemberLog[] = []

        // Check if member is valid
        if(!member.id)
        {
            throw Error('Member id is undefined')
        }

        if(!member.emailAddress)
        {
            throw Error('Member email is undefined')
        }

        // Get the member language
        let memberLang = this._locale.isValidOrDefault(member.locale)

        // Get member match with admin
        let memberMatchId = await this.getAdminMatchId(member.id)

        // this.buildEmail(
        //     this._memberEmail,
        //     await this._locale.key(this._locale.isValidOrDefault(member.locale), 'WALI_REJECTED_EMAIL_SUBJECT'),
        //     await this.buildRejectResponseEmailBody(member, answer)
        // )
        emails.push(
            EmailFactory.build({
                toEmail: member.emailAddress,
                from: 'support@muzmatch.com',
                subject: await this._locale.key(memberLang, 'WALI_REJECTED_EMAIL_SUBJECT'),
                body: await this._buildRejectEmail.execute(member, answer)
            })
        )

        // this.buildAdminMessage(
        //     await this._locale.key( this._locale.isValidOrDefault(member.locale), 'WALI_REJECTED_PROFILE'),
        //     "A",
        //     this._memberHashId,
        //     true,
        //     true
        // )
        messages.push(
            MessageFactory.build({
                memberId: member.id,
                memberHashId: member.hashId,
                matchId: memberMatchId,
                senderMemberId: 1,
                body: await this._locale.key(memberLang, 'WALI_REJECTED_PROFILE'),
                messageType: 'A',
                sendXmpp: true,
                sendPush: true
            })
        )

        // Send a message to the member with the reasons why he weas rejected
        // this.buildAdminMessage(
        //     await this.buildRejectResponseMessageBody(member, answer),
        //     "T",
        //     this._memberHashId,
        //     true,
        //     true
        // )

        messages.push(
            MessageFactory.build({
                memberId: member.id,
                memberHashId: member.hashId,
                matchId: memberMatchId,
                senderMemberId: 1,
                body: await this._buildRejectMessage.execute(member, answer),
                messageType: 'T',
                sendXmpp: true,
                sendPush: true
            })
        )

        // Return emails and messages
        return {
            emails,
            messages,
            logs
        }
    }

    private async getAdminMatchId(memberId : number) : Promise<number>
    {
        let match = await this._selectMatch.execute(memberId, 1)
        if(!match.id)
        {
            throw Error('Match not found')
        }
        return match.id
    }
}