import { Report } from './../../../../domain'


export default interface IInsertMemberReportCommand
{
    execute(report : Report) : Promise<null>
}
