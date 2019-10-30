import { 
    StaffLog,
    IStaffLogRepository,
    ReportIssue, 
    Member, 
    IReportIssueRepository, 
    CacheKeyService, 
    IMemberRepository,
    ILock,
    IWaliQueueService
 } from './../../Domain'
import BaseResponse from './../Shared/BaseResponse'
import EmptyQueueError from './../Shared/EmptyQueueError'


export default class GetIssueFlagQueue
{
    constructor(
        private _reportIssueRepo : IReportIssueRepository,
        private _memberRepo : IMemberRepository,
        private _staffLogRepo : IStaffLogRepository,
        private _lock : ILock,
        private _waliQueue : IWaliQueueService,
        private _cacheKey : CacheKeyService,
        private _response : BaseResponse)
    {
        //
    }

    async execute(staffId : number)
    {
        try {
            // 1. Generate and set up the correct key
            this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_ISSUE_FLAG_LOCKED'))
            this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_ISSUE_FLAG'))
            this._lock.waliQueueLock.setKey(this._cacheKey.generate('WALI_QUEUE_ISSUE_FLAG_LOCK'))
            
            // 2. Get all the current locked ids
            let queue = await this._lock.lockedTaskList.get()

            // 3. If the staff requesting a ticket already has one locked, then give me that one and add more time to it
            let pendingTickets = queue.filter((lockedTicket)=> {
                return lockedTicket.staffId === staffId
            })

            let issue : ReportIssue
            if(pendingTickets.length > 0)
            {
                // We found a pending ticket id in the queue lets get the ticket and update the lock timer
                let pendingTicket = pendingTickets[0]
                issue = await this._reportIssueRepo.findOne(pendingTicket.itemId)

            } else {
                // We didn't find any pending ticket so we will get the next ticket
                let foundIssueFromQueue = await this.getTaskFromQueue()
                if(foundIssueFromQueue)
                {
                    issue = foundIssueFromQueue
                } else {
                    issue = await this._lock.waliQueueLock.lock(async ()=> await this.fillQueueCallback())
                }
            }

            // If no more tasks into the queue
            if(!issue)
            {
                throw new EmptyQueueError('No more tasks in the Issue queue')
            }
            
            // 4. Lock the current task picked for the staff - ASAP
            await this._lock.lockedTaskList.add({
                itemId: issue.id,
                staffId: staffId
            })
            
            // 5. Get the 2 members to be included in the response payload
            let member : Member | undefined
            if(issue.memberId)
            {
                member = await this._memberRepo.findOne(issue.memberId)
            }

            // 6. Create the response object
            let response = this._response.body(issue, member)

            if(pendingTickets.length === 0)
            {
                // 7. Log the staff log for WALI_REPORT_VIEW
                let log = StaffLog.build({
                    staffId: staffId,
                    eventCode: 'WALI_ISSUE_FLAG_VIEW',
                    action: JSON.stringify(response),
                    memberId: member ? member.memberId : undefined
                })
                await this._staffLogRepo.add(log)
            }

            return response
        } catch(error) {
            console.log(error)
            throw error
        }
    }

    private async fillQueueCallback() : Promise<ReportIssue>
    {
        let taskQueue = await this._lock.lockedTaskList.get()
        let lockedTaskIds = taskQueue.map( task => task.itemId )
        let firstTask = await this._waliQueue.getFirst(lockedTaskIds)

        // Check if we have found a first id to get the task with or if it's null
        let report : ReportIssue
        if(!firstTask) {
            let reports = await this._reportIssueRepo.allFlagged()

            if (reports.length === 0) {
                throw new EmptyQueueError('No more tasks in the Issue flag queue')
            }

            await this._waliQueue.push(reports.map(issue => issue.id))
            report = reports[0]
        } else {
            report = await this._reportIssueRepo.findOne(firstTask)
        }

        return report
    }

    private async getTaskFromQueue()
    {
        let taskQueue = await this._lock.lockedTaskList.get()
        let lockedTaskIds = taskQueue.map( task => task.itemId )
        let firstTask = await this._waliQueue.getFirst(lockedTaskIds)

        if(!firstTask) 
        {
            return null
        }
        return await this._reportIssueRepo.findOne(firstTask)
    }
}