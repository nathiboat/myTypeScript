import { Context } from './../../index'
import { IInsertStaffSessionCommand, StaffSession } from './../../../../../domain'
import StaffSessionMap from './StaffSessionMap'



export default class InsertStaffSessionCommand implements IInsertStaffSessionCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(staffSession : StaffSession)
    {
        this.context.connect()
        
        let columns = Object.keys(StaffSessionMap.deconstruct(staffSession)).join(',')
        let values = Object.values(StaffSessionMap.deconstruct(staffSession))
        
        let result = await this.context.query(
            `INSERT INTO staffSessions (${ columns }) VALUES (?)`, [values])
            
        this.context.complete()
        return null
    }
}
