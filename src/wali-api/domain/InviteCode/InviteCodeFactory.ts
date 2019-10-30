import InviteCode from './InviteCode'

type InviteCodeOptions = {
    inviteCode : string,
    state? : string,
    description? : string,
    createdAtTimeStamp? : string,
    expiresAtTimeStamp? : string,
    premiumForDays? : number,
    extraSwipes? : number,
    instantMatches? : number,
    fallbackExtraSwipes? : number,
    fallbackInstantMatches? : number,
    id? : number
}

export default abstract class InviteCodeFactory {

    static build(options: InviteCodeOptions) {

        let inviteCode = new InviteCode(
            options.inviteCode,
            options.state,
            options.description,
            options.createdAtTimeStamp,
            options.expiresAtTimeStamp,
            options.premiumForDays,
            options.extraSwipes,
            options.instantMatches,
            options.fallbackExtraSwipes,
            options.fallbackInstantMatches,
            options.id
            )

        return inviteCode
    }
}
