import { Context } from '../../index'
import ReportMap from './ReportMap'
import { Report, IInsertMemberReportCommand } from './../../../../../domain'


export default class InsertMemberReportCommand implements IInsertMemberReportCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(report : Report)
    {
        this.context.connect()
        
        let columns = Object.keys(ReportMap.deconstruct(report)).join(',')
        let values = Object.values(ReportMap.deconstruct(report))

        await this.context.query(
            `INSERT INTO members_reports (${ columns }) VALUES (?)`, [values])
        this.context.complete()
        return null
    }
}
