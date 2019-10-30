import BaseRepository from './../BaseRepository'
import Context from './../Context'
import { MemberApprove, IMemberApproveRepository } from './../../../../Domain'
import MemberApproveTransformer from './MemberApproveTransformer';


export default class MemberApproveRepository extends BaseRepository<MemberApprove> implements IMemberApproveRepository
{
    constructor(context : Context)
    {
        super(context)
    }

    async findOne(id : number)
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM membersApproval WHERE memberID = ? LIMIT 1', [ id ])
        
        this._context.complete()
        return MemberApproveTransformer.toModel(result)[0]
    }

    async allActioned()
    {
        this._context.connect()
        let result = await this._context.query('SELECT * FROM membersApproval WHERE actioned = 1')
        
        this._context.complete()
        return MemberApproveTransformer.toModel(result)
    }

    async updateActioned(id : number, value : boolean) : Promise<boolean>
    {
        this._context.connect()
        let result = await this._context.query('UPDATE membersApproval SET actioned = ? WHERE memberID = ?', [ value, id ])
        
        this._context.complete()
        return result
    }

    async updateFlagged(id : number, value : boolean) : Promise<boolean>
    {
        this._context.connect()
        let result = await this._context.query('UPDATE membersApproval SET wali_flagged = ? WHERE memberID = ?', [ value, id ])
        
        this._context.complete()
        return result
    }
}