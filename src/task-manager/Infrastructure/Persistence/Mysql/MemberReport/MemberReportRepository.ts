import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { MemberReport, IMemberReportRepository } from './../../../../Domain'
import MemberReportTransformer from './MemberReportTransformer';


export default class MemberReportRepository extends BaseRepository<MemberReport> implements IMemberReportRepository
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOne(id : number)
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM members_reports WHERE id = ? LIMIT 1', [ id ])
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)[0]
    }

    async allActioned()
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.actioned = 1`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    async updateActioned(id : number, value : boolean) : Promise<boolean>
    {
        this._context.connect()
        let result = await this._context.query('UPDATE members_reports SET actioned = ? WHERE id = ?', [ value, id ])
        
        this._context.complete()
        return result
    }

    async updateFlagged(id : number, value : boolean) : Promise<boolean>
    {
        this._context.connect()
        let result = await this._context.query('UPDATE members_reports SET wali_flagged = ? WHERE id = ?', [ value, id ])
        
        this._context.complete()
        return result
    }

    // INAPPROPRIATE_PROFILE

    async allInappropriateProfiles() : Promise<MemberReport[]> 
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "INAPPROPRIATE_PROFILE"
                    AND mr.actioned = 0
                    AND wali_flagged = 0
            ORDER BY 
                m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    async allFlaggedInappropriateProfiles() : Promise<MemberReport[]> 
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "INAPPROPRIATE_PROFILE"
                    AND mr.actioned = 0
                    AND wali_flagged = 1
            ORDER BY 
            m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    // INAPPROPRIATE_MESSAGES

    async allInappropriateMessages() : Promise<MemberReport[]> 
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "INAPPROPRIATE_MESSAGES"
                    AND mr.actioned = 0
                    AND wali_flagged = 0
            ORDER BY 
                m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    async allFlaggedInappropriateMessages() : Promise<MemberReport[]>
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "INAPPROPRIATE_MESSAGES"
                    AND mr.actioned = 0
                    AND wali_flagged = 1
            ORDER BY 
                m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    // SPAM_OR_SCAM

    async allSpamOrScams() : Promise<MemberReport[]>
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "SPAM_OR_SCAM"
                    AND mr.actioned = 0
                    AND wali_flagged = 0
            ORDER BY 
                m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    async allFlaggedSpamOrScams() : Promise<MemberReport[]>
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "SPAM_OR_SCAM"
                    AND mr.actioned = 0
                    AND wali_flagged = 1
            ORDER BY 
                m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    // OTHER

    async allOthers() : Promise<MemberReport[]>
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "OTHER"
                    AND mr.actioned = 0
                    AND wali_flagged = 0
            ORDER BY 
                m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }

    async allFlaggedOthers() : Promise<MemberReport[]>
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT 
                *
            FROM
                members_reports mr
            LEFT JOIN 
                members m ON mr.memberID = m.memberId
            WHERE
                mr.issueType = "OTHER"
                    AND mr.actioned = 0
                    AND wali_flagged = 1
            ORDER BY 
                m.activeProfile DESC, m.premium DESC, mr.timeStamp ASC`)
        
        this._context.complete()
        return MemberReportTransformer.toModel(result)
    }
}