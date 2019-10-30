import { ISelectApprovalPendingMemberIdsQuery } from './../../domain'
import { IWaliApproveList } from './../'


export default class GetPendingApprovalNumberService
{
    private _selectApprovalPendingIds: ISelectApprovalPendingMemberIdsQuery

    private _waliApproveList : IWaliApproveList

    constructor(
        selectApprovalPendingIds : ISelectApprovalPendingMemberIdsQuery,
        waliApproveList : IWaliApproveList
    ) {
        this._selectApprovalPendingIds = selectApprovalPendingIds
        this._waliApproveList          = waliApproveList
    }

    async execute()
    {
        try {
            // 1. Get member to be approved from database OR from the cache

            let cachedMemberIds = await this._waliApproveList.content()

            if(cachedMemberIds.length === 0)
            {
                let memberIds = await this._selectApprovalPendingIds.execute()
                await this._waliApproveList.push(memberIds)
                return memberIds.length
                
            } else {
                return cachedMemberIds.length
            }
        } catch(error) {
            throw Error(error.message)
        }
    }
}
