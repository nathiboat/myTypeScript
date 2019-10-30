import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { ReportIssue, IReportIssueRepository } from './../../../../Domain'
import ReportIssueTransformer from './ReportIssueTransformer';


export default class ReportIssueRepository extends BaseRepository<ReportIssue> implements IReportIssueRepository
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOne(id : number)
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM reportedIssues WHERE id = ? LIMIT 1', [ id ])
        
        this._context.complete()
        return ReportIssueTransformer.toModel(result)[0]
    }

    async updateActioned(id : number, value : boolean)
    {
        this._context.connect()
        let result = await this._context.query('UPDATE reportedIssues SET actioned = ? WHERE id = ?', [ value, id ])
        
        this._context.complete()
        return result
    }

    async updateFlagged(id : number, value : boolean)
    {
        this._context.connect()
        let result = await this._context.query('UPDATE reportedIssues SET wali_flagged = ? WHERE id = ?', [ value, id ])
        
        this._context.complete()
        return result
    }

    async all()
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                ri.*
            FROM
                reportedIssues ri
            LEFT JOIN 
                members m ON ri.memberID = m.memberId 
            WHERE
                m.memberId IS NOT NULL
                AND actioned = 0
                AND wali_flagged = 0
            ORDER BY 
                m.activeprofile DESC, m.premium DESC, FIELD(type, 'PAYMENTS'), ri.timeStamp ASC`)

        this._context.complete()
        return ReportIssueTransformer.toModel(result)
    }

    async allActioned()
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                ri.*
            FROM
                reportedIssues ri
            LEFT JOIN 
                members m ON ri.memberID = m.memberId 
            WHERE
                m.memberId IS NOT NULL
                AND actioned = 1`)

        this._context.complete()
        return ReportIssueTransformer.toModel(result)
    }

    async allFlagged()
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                ri.*
            FROM
                reportedIssues ri
            LEFT JOIN 
                members m ON ri.memberID = m.memberId 
            WHERE
                m.memberId IS NOT NULL
                AND actioned = 0
                AND wali_flagged = 1
            ORDER BY 
                m.activeprofile DESC, m.premium DESC, FIELD(type, 'PAYMENTS'), ri.timeStamp ASC`)

        this._context.complete()
        return ReportIssueTransformer.toModel(result)
    }
}