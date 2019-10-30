import { MemberDB } from './../../../infrastructure/Persistence/Mysql'
import { QuestionCollection } from './../../../infrastructure/Persistence/FileSystem'
import { IWaliApproveLock, IWaliApproveList } from './../../'
import BaseResponse from './../../BaseResponse'
import { IInsertStaffLogCommand, StaffLogFactory, ISelectApprovalPendingMemberIdsQuery } from './../../../domain'


export default class GenerateQuestionsForMembers
{
    private _selectApprovalPendingMemberIdsQuery: ISelectApprovalPendingMemberIdsQuery

    private _selectMemberByIdQuery: MemberDB.Queries.SelectMemberByIdQuery

    private _questionCollection : QuestionCollection

    private _waliApproveLock : IWaliApproveLock

    private _waliApproveList : IWaliApproveList

    private _insertStaffLog : IInsertStaffLogCommand

    private _response : BaseResponse

    constructor(
        selectApprovalPendingMemberIdsQuery : ISelectApprovalPendingMemberIdsQuery,
        selectMemberByIdQuery : MemberDB.Queries.SelectMemberByIdQuery,
        questionCollection : QuestionCollection,
        waliApproveLock : IWaliApproveLock,
        waliApproveList : IWaliApproveList,
        insertStaffLog : IInsertStaffLogCommand,
        response : BaseResponse
    ) {
        this._selectApprovalPendingMemberIdsQuery = selectApprovalPendingMemberIdsQuery
        this._selectMemberByIdQuery               = selectMemberByIdQuery
        this._questionCollection                  = questionCollection
        this._waliApproveLock                     = waliApproveLock
        this._waliApproveList                     = waliApproveList
        this._insertStaffLog                      = insertStaffLog
        this._response                            = response
    }

    async execute(staffId : number)
    {
        try {
            // 1. Get ids stored in the lock cache (all locked ids)
            let queueMembers = await this._waliApproveLock.get()
            let ids          = queueMembers.map(member => member.memberId)

            // 2. Get member to be approved from database
            // let memberIds    = await this._selectApprovalPendingMemberIdsQuery.execute(ids)
            // let memberId     = memberIds[0]

            // Try to get the member id from lock if lock empty ask the evil query
            let memberId : number
            let cachedMemberIds = await this._waliApproveList.content()
            
            if(cachedMemberIds.length === 0)
            {
                let memberIds = await this._selectApprovalPendingMemberIdsQuery.execute(ids)
                
                if(memberIds.length === 0)
                {
                    // Trigger event, APPROVE_NO_MORE_PROFILES, and return null
                    await this._insertStaffLog.execute(StaffLogFactory.build({
                        staffId: staffId,
                        eventCode: 'APPROVE_NO_MORE_PROFILES'
                    }))
                    return null
                }

                await this._waliApproveList.push(memberIds)
                memberId = memberIds[0]
            } else {
                memberId = cachedMemberIds[0]
            }

            let memberResult = await this._selectMemberByIdQuery.execute(memberId)
            let member       = memberResult[0]

            // 3. Store new member in the approve lock cache
            this._waliApproveLock.push({
                memberId: memberId,
                staffId: staffId,
                ttl: this._waliApproveLock.addExpireIn()
            })

            // 4. Get the questions for the selected member
            let questions = await this._questionCollection.execute(member)

            // Trigger events after checking if the questions array has questions in it
            if(questions.length === 0)
            {
                let action = {
                    profileCreated: member.complete,
                    fields: ''
                }
                await this._insertStaffLog.execute(StaffLogFactory.build({
                    staffId: staffId,
                    memberId: member.id,
                    eventCode: 'PROFILE_NOT_APPROVED',
                    action: JSON.stringify(action)
                }))
            } else {
                let action = {
                    profileCreated: member.complete,
                    fields: questions.map((question)=> { return question.field }).join(',')
                }
                await this._insertStaffLog.execute(StaffLogFactory.build({
                    staffId: staffId,
                    memberId: member.id,
                    eventCode: 'APPROVE_VIEW',
                    action: JSON.stringify(action)
                }))
            }

            // 5. Send back the member and the questions
            return this._response.body(member, questions)

        } catch(error) {
            throw Error(error.message)
        }
    }
}
