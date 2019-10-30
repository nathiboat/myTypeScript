import {
    Member,
    InviteCode, 
    IUpdateMemberRewardTransaction } from './../../../../domain'
import { ILocale } from './../../../../application'
import IBuildRewardFromInviteCode from './IBuildRewardFromInviteCode'



export default class BuildRewardFromInviteCode implements IBuildRewardFromInviteCode
{
    private _updateRewardTransaction : IUpdateMemberRewardTransaction

    private _locale : ILocale


    constructor(
        updateRewardTransaction : IUpdateMemberRewardTransaction,
        locale : ILocale
    ) {
        this._updateRewardTransaction = updateRewardTransaction
        this._locale                  = locale
    }

    async execute(member : Member, inviteCode : InviteCode) : Promise<string | null>
    {
        let memberLocale = this._locale.isValidOrDefault(member.locale)

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
                memberLocale,
                'WALI_REWARDS_DAYS_OF_PREMIUM',
                { d : inviteCode.premiumForDays }
            )
            messageBody.push(`- ${ text }`)

            // Add to the transaction
            this._updateRewardTransaction.setMemberPremiumForDays(member.id!, inviteCode.premiumForDays)
        }

        // if inviteCode does not offer extra swipes
        if(inviteCode.extraSwipes)
        {
            let text = await this._locale.key(
                memberLocale,
                'WALI_REWARDS_EXTRA_SWIPES',
                { d : inviteCode.extraSwipes }
            )
            messageBody.push(`- ${ text }`)

            // Add to the transaction
            this._updateRewardTransaction.setMemberSwipeAllocation(member.id!, inviteCode.extraSwipes)
        }

        // if inviteCode does not offer instant matches
        if(inviteCode.instantMatches)
        {
            let text = await this._locale.key(
                memberLocale,
                'WALI_REWARDS_INSTANT_MATCHES',
                { d : inviteCode.instantMatches }
            )
            messageBody.push(`- ${ text }`)

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
            // Return the complete message body as string
            return messageBody.join(' \n ')
        }
        return null
    }
}