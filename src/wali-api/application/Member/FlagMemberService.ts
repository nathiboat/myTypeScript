import {
    ApprovalFactory,
    ISelectMemberByHashIdQuery,
    ISelectMemberApprovalByIdQuery,
    IUpdateMemberApprovalCommand,
    IInsertMemberApprovalCommand } from './../../domain'
import { IWaliApproveList } from './../'



export default class FlagMemberService
{
    private _selectMemberByHashId: ISelectMemberByHashIdQuery

    private _selectMemberApprovalById: ISelectMemberApprovalByIdQuery

    private _updateMemberApproval: IUpdateMemberApprovalCommand

    private _insertMemberApproval: IInsertMemberApprovalCommand

    private _waliApproveList : IWaliApproveList

    constructor(
        selectMemberByHashId: ISelectMemberByHashIdQuery,
        selectMemberApprovalById: ISelectMemberApprovalByIdQuery,
        updateMemberApproval: IUpdateMemberApprovalCommand,
        insertMemberApproval: IInsertMemberApprovalCommand,
        waliApproveList : IWaliApproveList
    ) {
        this._selectMemberByHashId     = selectMemberByHashId
        this._selectMemberApprovalById = selectMemberApprovalById
        this._updateMemberApproval     = updateMemberApproval
        this._insertMemberApproval     = insertMemberApproval
        this._waliApproveList          = waliApproveList
    }

    async execute(memberHashId : string)
    {
        // 1. check if member is exist in database
        let member = await this._selectMemberByHashId.execute(memberHashId);
    
        if(!member)
        {
            throw Error(`Member was not found`)
        }

        if(!member.id)
        {
            throw Error('Member id is undefined')
        }

        // 2. get member approval data if exist in database
        let approvalResult = await this._selectMemberApprovalById.execute(member.id)
        let approval = approvalResult[0]

        if(approval)
        {
            // 3. set staff flagged to true
            approval.setStaffFlagged(true)
            approval.setActioned(false)

            // 4. update member approval command
            await this._updateMemberApproval.execute(approval)
        } else {
            // if there is no approval data
            // 5. build approval
            let newApproval = ApprovalFactory.build({
                memberId: member.id,
                photo1 : false,
                photo2 : false,
                photo3 : false,
                photo4 : false,
                photo5 : false,
                photoVerification : false,
                statusMessage : false,
                longDescription : false,
                staffFlagged : true,
                attempts : 0
            })
            
            // 6. insert member approval into table
            await this._insertMemberApproval.execute(newApproval)
        }

        // Remove member id from wali approve list
        await this._waliApproveList.remove(member.id)

        return  true
    }
}
