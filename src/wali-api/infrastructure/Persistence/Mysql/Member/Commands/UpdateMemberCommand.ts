import { Context } from '../../index'
import MemberMap from './MemberMap'
import { Member, IUpdateMemberCommand } from './../../../../../domain'



export default class UpdateMemberCommand implements IUpdateMemberCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(member : Member)
    {
        this.context.connect()
        
        let pairs = Object.keys(MemberMap.deconstruct(member)).map((key)=> {
            return `${ key } = ?`
        }).join(',')

        let values = Object.values(MemberMap.deconstruct(member))

        await this.context.query(
            `UPDATE members
             SET ${ pairs }
             WHERE memberID = ?`, [ ...values, member.id])
        this.context.complete()
        return null
    }
}
