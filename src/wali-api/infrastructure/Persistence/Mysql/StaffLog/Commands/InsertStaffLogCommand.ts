import { Context } from '../../index'
import { StaffLog } from '../../../../../domain'
import StaffLogMap from './StaffLogMap'
import { IInsertStaffLogCommand } from './../../../../../domain'


export default class InsertStaffLogCommand implements IInsertStaffLogCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(staffLog : StaffLog)
    {
        this.context.connect()
        
        let values = Object.values(StaffLogMap.deconstruct(staffLog))
        let columns = Object.keys(StaffLogMap.deconstruct(staffLog)).join(',')

        await this.context.query(`INSERT INTO staffLogs (${ columns }) VALUES (?)`, [values])

        this.context.complete()
        return null
    }
}
