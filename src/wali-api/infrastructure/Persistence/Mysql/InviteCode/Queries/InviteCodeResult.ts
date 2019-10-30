import { InviteCode, InviteCodeFactory } from './../../../../../domain'

export default class InviteCodeResult
{
    private rows : { [key : string] : any }[]

    constructor(rows : { [key : string] : any }[])
    {
        this.rows = rows
    }

    retrieve()
    {
        return this.rows.map((row)=> {

            let match = InviteCodeFactory.build({
                inviteCode: row.inviteCode,
                id: row.id,
                description: row.id,
                createdAtTimeStamp: row.createdAtTimeStamp,
                expiresAtTimeStamp: row.expiresAtTimeStamp,
                premiumForDays: row.premiumForDays,
                extraSwipes: row.extraSwipes,
                instantMatches: row.instantMatches,
                fallbackExtraSwipes: row.fallbackExtraSwipes,
                fallbackInstantMatches: row.fallbackInstantMatches,
                state: row.state 
            })

            return match
        })
    }
}