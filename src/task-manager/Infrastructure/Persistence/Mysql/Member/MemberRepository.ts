import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { Member, IMemberRepository } from './../../../../Domain'
import MemberTransformer from './MemberTransformer';


export default class MemberRepository extends BaseRepository<Member> implements IMemberRepository
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOne(id : number)
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM members WHERE memberID = ? LIMIT 1', [ id ])

        this._context.complete()
        return MemberTransformer.toModel(result)[0]
    }

    async all()
    {
        this._context.connect()
        let result = await this._context.query(`
            SELECT
                *
            FROM members m LEFT JOIN membersApproval a ON (a.memberID = m.memberID)
            WHERE m.profileCreated > 0 AND m.permanentlyBlocked = 0 AND m.approved = 0 AND m.deleteAfterTimeStamp IS NULL and
                (m.profileReviewedByAdmin=0 or (
                (m.profileReviewedByAdmin=1 and m.profileCreated=1 and (m.photo1 is not null and m.photoVerification is not null) or
                (m.profileReviewedByAdmin=1 and m.profileCreated=2 and (m.photo1 is not null and m.photoVerification is not null and m.longDescription is not null)))))
                AND (
                (m.photo1 IS NOT NULL AND a.photo1 IS NULL) OR
                (m.photo2 IS NOT NULL AND a.photo2 IS NULL) OR
                (m.photo3 IS NOT NULL AND a.photo3 IS NULL) OR
                (m.photo4 IS NOT NULL AND a.photo4 IS NULL) OR
                (m.photo5 IS NOT NULL AND a.photo5 IS NULL) OR
                (m.photoVerification IS NOT NULL AND a.photoVerification IS NULL) OR
                (m.statusMessage IS NOT NULL AND a.statusMessage IS NULL) OR
                (m.longDescription IS NOT NULL AND a.longDescription IS NULL))
                AND IFNULL(a.staffFlagged,0) = 1 AND wali_flagged = 0
            ORDER BY 
                    m.activeprofile DESC, m.premium DESC, m.timestamp ASC`)
        
        this._context.complete()
        return MemberTransformer.toModel(result)
    }

    async allFlagged()
    {
        this._context.connect()
        let result = await this._context.query(`
        SELECT
            *
        FROM members m LEFT JOIN membersApproval a ON (a.memberID = m.memberID)
        WHERE m.profileCreated > 0 AND m.permanentlyBlocked = 0 AND m.approved = 0 AND m.deleteAfterTimeStamp IS NULL and
            (m.profileReviewedByAdmin=0 or (
            (m.profileReviewedByAdmin=1 and m.profileCreated=1 and (m.photo1 is not null and m.photoVerification is not null) or
            (m.profileReviewedByAdmin=1 and m.profileCreated=2 and (m.photo1 is not null and m.photoVerification is not null and m.longDescription is not null)))))
            AND (
            (m.photo1 IS NOT NULL AND a.photo1 IS NULL) OR
            (m.photo2 IS NOT NULL AND a.photo2 IS NULL) OR
            (m.photo3 IS NOT NULL AND a.photo3 IS NULL) OR
            (m.photo4 IS NOT NULL AND a.photo4 IS NULL) OR
            (m.photo5 IS NOT NULL AND a.photo5 IS NULL) OR
            (m.photoVerification IS NOT NULL AND a.photoVerification IS NULL) OR
            (m.statusMessage IS NOT NULL AND a.statusMessage IS NULL) OR
            (m.longDescription IS NOT NULL AND a.longDescription IS NULL))
            AND IFNULL(a.staffFlagged,0) = 1 AND wali_flagged = 1
        ORDER BY 
                m.activeprofile DESC, m.premium DESC, m.timestamp ASC`)
        
        this._context.complete()
        return MemberTransformer.toModel(result)
    }
}