import { Context } from '../../index'
import { MemberLog } from '../../../../../domain'
import MemberLogMap from './MemberLogMap'
import { IInsertMemberLogCommand } from './../../../../../domain'


export default class InsertMemberLogCommand implements IInsertMemberLogCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(memberLog : MemberLog)
    {
        this.context.connect()

        let values = Object.values(MemberLogMap.deconstruct(memberLog))
        let columns = Object.keys(MemberLogMap.deconstruct(memberLog)).join(',')

        await this.context.query(`INSERT INTO logs (${ columns }) VALUES (?)`, [values])

        this.context.complete()
        return null
    }
}
