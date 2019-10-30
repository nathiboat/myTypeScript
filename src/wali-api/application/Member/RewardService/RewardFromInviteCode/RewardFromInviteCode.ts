import {
    Member,
    MemberLog,
    Message,
    MessageFactory,
    MemberLogFactory,
    Email,
    EmailFactory,

    ISelectInviteCodeQuery, 
    ISelectMatchIdQuery} from './../../../../domain'
import { ILocale } from './../../../../application'
import { IBuildRewardFromInviteCode } from './../BuildRewardFromInviteCode'
import IRewardFromInviteCode from './IRewardFromInviteCode'


export default class RewardFromInviteCode implements IRewardFromInviteCode
{
    private _selectInviteCode : ISelectInviteCodeQuery

    private _buildReward : IBuildRewardFromInviteCode

    private _selectMatch : ISelectMatchIdQuery

    private _locale : ILocale


    constructor(
        selectInviteCode : ISelectInviteCodeQuery,
        buildReward : IBuildRewardFromInviteCode,
        selectMatch : ISelectMatchIdQuery,
        locale : ILocale
    ) {
        this._selectInviteCode = selectInviteCode
        this._buildReward      = buildReward
        this._selectMatch      = selectMatch
        this._locale           = locale
    }

    async execute(member : Member, referrerInviteCode : string)
    {
        let logs : MemberLog[] = []
        let messages : Message[] = []
        let emails : Email[] = []

        // Get the member language
        let memberLang = this._locale.isValidOrDefault(member.locale)

        if(!member.id)
        {
            throw new Error('Member id is undefined')
        }

        if(!member.emailAddress)
        {
            throw new Error('Member email address is undefined')
        }

        // Get the current invite code from database
        let inviteCodeResult = await this._selectInviteCode.execute(referrerInviteCode)
        let inviteCode = inviteCodeResult[0]

        if(!inviteCode)
        {
            throw Error('Invite code was not found')
        }

        // Trigger log
        logs.push(
            MemberLogFactory.build({
                memberId: member.id, 
                eventCode: 'INVITED_MEMBER_CREDITS_EARNED', 
                action: `Earned credits from ${ member.id } approval`}
            )
        )
        // TODO This should be also sent to member WALI_REWARDS_REFERRERCODE_BECAUSE_YOU

        // Build rewards from invite codes
        let rewardMessageBody = await this._buildReward.execute(member, inviteCode)

        // Send the reward message to member
        if(rewardMessageBody)
        {
            let matchId = await this.getAdminMatchId(member.id)

            messages.push(
                MessageFactory.build({
                    memberId: member.id,
                    memberHashId: member.hashId,
                    matchId: matchId,
                    senderMemberId: 1,
                    body:  await this._locale.key('EN', 'WALI_REWARDS_REFERRERCODE_BECAUSE_YOU'),
                    messageType: 'T',
                    sendXmpp: false,
                    sendPush: false
                })
            )

            messages.push(
                MessageFactory.build({
                    memberId: member.id,
                    memberHashId: member.hashId,
                    matchId: matchId,
                    senderMemberId: 1,
                    body: rewardMessageBody,
                    messageType: 'T',
                    sendXmpp: false,
                    sendPush: false
                })
            )
            
            // ! This key WALI_REWARDS_REFERRERMEMBER_YOU_SHARE can not be found in json file
            // messages.push(
            //     MessageFactory.build({
            //         memberId: member.id,
            //         memberHashId: member.hashId,
            //         matchId: matchId,
            //         senderMemberId: 1,
            //         body: await this._locale.key('EN', 'WALI_REWARDS_REFERRERMEMBER_YOU_SHARE'),
            //         messageType: 'T',
            //         sendXmpp: false,
            //         sendPush: false
            //     })
            // )
        }

        // Send different email if member is active or not
        let subjectKey = (member.activeProfile === 1) ? 'WALI_APPROVED_PROFILE' : 'WALI_APPROVED_INACTIVE_EMAIL_SUBJECT'
        let bodyKey    = (member.activeProfile === 1) ? 'WALI_REWARDS_REFERRERCODE_ACTIVE_EMAIL' : 'WALI_REWARDS_REFERRERCODE_INACTIVE_EMAIL'

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
            logs
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