import {
    Member, 
    Message,
    MessageFactory,
    Email,
    EmailFactory,

    IUpdateMemberCommand, 
    ISelectMatchIdQuery } from './../../../../domain'
import { ILocale } from './../../../../application'



export default class RewardDefault
{
    private _updateMember :IUpdateMemberCommand

    private _selectMatch : ISelectMatchIdQuery

    private _locale : ILocale

    constructor(
        updateMember : IUpdateMemberCommand,
        selectMatch : ISelectMatchIdQuery,
        locale : ILocale
    ) {
        this._updateMember = updateMember
        this._selectMatch  = selectMatch
        this._locale       = locale
    }

    async execute(member : Member)
    {
        let messages : Message[] = []
        let emails : Email[] = []

        let memberLang = this._locale.isValidOrDefault(member.locale)

        if(!member.id)
        {
            throw Error('Member id is undefined')
        }

        if(!member.emailAddress)
        {
            throw Error('Member email address is undefined')
        }

        // Increment the number of instant match on the member
        member.instantMatchCredit = member.instantMatchCredit + 1
        await this._updateMember.execute(member)

        let matchId = await this.getAdminMatchId(member.id)

        messages.push(
            MessageFactory.build({
                memberId: member.id,
                memberHashId: member.hashId,
                matchId: matchId,
                senderMemberId: 1,
                body: await this._locale.key('EN', 'WALI_REWARDS_WITHOUTREFERRER_MESSAGE'),
                messageType: 'T',
                sendXmpp: false,
                sendPush: false
            })
        )

        // Send email to the member
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

        return {
            messages,
            emails,
            logs: [] // No logs here, but keep the interface the same
        }
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