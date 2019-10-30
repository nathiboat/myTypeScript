import { 
    IMemberRepository,
    IMemberReportRepository,
    IReportIssueRepository,
    CacheKeyService,
    ILock,
    IWaliQueueService,
    TaskType,
    MemberReport } from './../../Domain'
import BaseResponse from './../Shared/BaseResponse'



export default class CountFlagTasks
{
    constructor(
        private _memberRepo : IMemberRepository,
        private _memberReportRepo : IMemberReportRepository,
        private _reportIssueRepo : IReportIssueRepository,
        private _lock : ILock,
        private _waliQueue : IWaliQueueService,
        private _cacheKey : CacheKeyService,
        private _response : BaseResponse)
    {
        //
    }

    async execute(taskType : string)
    {
        try {
            let type = new TaskType(taskType)

            switch(type.value)
            {
                case 'approve':
                    return await this.countApproveTickets()
                case 'inappropriate-profile-report':
                case 'inappropriate-messages-report':
                case 'spam-or-scam-report':
                case 'other-report':
                    return await this.countMemberReportTickets(type.value)
                case 'issue':
                    return await this.countReportIssueeTickets()
                default:
                    throw Error('Ticket type is not valid')
            }
        } catch(error) {
            console.log(error)
            throw error
        }
    }

    private async countApproveTickets()
    {
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_APPROVE_FLAG'))
        this._lock.waliQueueLock.setKey(this._cacheKey.generate('WALI_QUEUE_APPROVE_FLAG_LOCK'))

        let count = await this.getCountFromQueue()
        if(!count)
        {
            count = await this._lock.waliQueueLock.lock(async ()=> await this.fillApproveQueueCallback())
        }
        return this._response.body(count, 'approve')
    }

    private async countMemberReportTickets(taskType : string)
    {
        this._waliQueue.setKey(this._cacheKey.generate(`WALI_QUEUE_${ taskType.toUpperCase().split('-').join('_') }_FLAG`))
        this._lock.waliQueueLock.setKey(this._cacheKey.generate(`WALI_QUEUE_${ taskType.toUpperCase().split('-').join('_') }_FLAG_LOCK`))

        let count = await this.getCountFromQueue()
        if(!count)
        {
            count = await this._lock.waliQueueLock.lock(async ()=> await this.fillReportQueueCallback(taskType))
        }
        return this._response.body(count, taskType)
    }

    private async countReportIssueeTickets()
    {
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_ISSUE_FLAG'))
        this._lock.waliQueueLock.setKey(this._cacheKey.generate('WALI_QUEUE_ISSUE_FLAG_LOCK'))
        
        let count = await this.getCountFromQueue()
        if(!count)
        {
            count = await this._lock.waliQueueLock.lock(async ()=> await this.fillIssueQueueCallback())
        }
        return this._response.body(count, 'issue')
    }

    private async getCountFromQueue()
    {
        let content = await this._waliQueue.getContent()
        if(content.length === 0)
        {
            return null
        }
        return content.length
    }

    private async fillApproveQueueCallback()
    {
        let content = await this._waliQueue.getContent()
        if(content.length === 0)
        {
            let members = await this._memberRepo.allFlagged()
            let ids = members.map((member)=> member.memberId)

            await this._waliQueue.push(ids)

            // Return same content with updated ids
            content = ids
        }

        return content.length
    }

    private async fillReportQueueCallback(taskType : string)
    {
        let content = await this._waliQueue.getContent()
        if(content.length === 0)
        {
            let reports : MemberReport[] = []
            switch(taskType)
            {
                case 'inappropriate-profile-report':
                    reports = await this._memberReportRepo.allFlaggedInappropriateProfiles()
                    break
                case 'inappropriate-messages-report':
                    reports = await this._memberReportRepo.allFlaggedInappropriateMessages()
                    break
                case 'spam-or-scam-report':
                    reports = await this._memberReportRepo.allFlaggedSpamOrScams()
                    break
                case 'other-report':
                    reports = await this._memberReportRepo.allFlaggedOthers()
                    break
                default:
                    throw Error(`Task type ${ taskType } is not valid`)
            }
            let ids = reports.map((report)=> report.id)

            await this._waliQueue.push(ids)

            // Return same content with updated ids
            content = ids
        }

        return content.length
    }

    private async fillIssueQueueCallback()
    {
        let content = await this._waliQueue.getContent()
        if(content.length === 0)
        {
            let issues = await this._reportIssueRepo.allFlagged()
            let ids = issues.map((issue)=> issue.id)

            await this._waliQueue.push(ids)

            // Return same content with updated ids
            content = ids
        }

        return content.length
    }
}