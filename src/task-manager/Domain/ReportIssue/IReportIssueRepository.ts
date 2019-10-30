import ReportIssue from './ReportIssue'


export default interface IReportIssueRepository
{
    findOne(id : number) : Promise<ReportIssue>

    updateActioned(id : number, value : boolean) : Promise<boolean>

    updateFlagged(id : number, value : boolean) : Promise<boolean>

    all() : Promise<ReportIssue[]>

    allActioned() : Promise<ReportIssue[]>

    allFlagged() : Promise<ReportIssue[]>
}