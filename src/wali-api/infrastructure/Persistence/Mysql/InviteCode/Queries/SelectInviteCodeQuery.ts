import { Context } from '../..'
import InviteCodeResult from './InviteCodeResult'
import { ISelectInviteCodeQuery } from '../../../../../domain'

export default class SelectInviteCodeQuery implements ISelectInviteCodeQuery {

    private _context : Context

    constructor (context : Context) {
        this._context = context
    }

    async execute (inviteCode : string) {

        this._context.connect()

        let rows = await this._context.query(
            'SELECT * FROM `inviteCodes` WHERE `inviteCode` = ?', [inviteCode]
        )

        this._context.complete()
        return new InviteCodeResult(rows).retrieve()
    }
}