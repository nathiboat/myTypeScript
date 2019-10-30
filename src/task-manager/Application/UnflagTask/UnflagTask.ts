import BaseResponse from './../Shared/BaseResponse'
import { 
    CacheKeyService,
    Flag,
    TaskType,
    IFlagRepository,
    IMemberApproveRepository,
    IMemberReportRepository,
    IReportIssueRepository,
    StaffLog, 
    IStaffLogRepository,
    VirtualQueue,
    ILock,
    IWaliQueueService } from './../../Domain'
import UnflagTaskError from './UnflagTaskError'


export default class UnflagTask
{
    constructor(
        private _flagRepo : IFlagRepository,
        private _approveRepo : IMemberApproveRepository,
        private _reportRepo : IMemberReportRepository,
        private _issueRepo : IReportIssueRepository,
        private _staffLogRepo : IStaffLogRepository,
        private _lock : ILock,
        private _waliQueue : IWaliQueueService,
        private _cacheKey : CacheKeyService,
        private _response : BaseResponse)
    {

    }

    async execute(staffId : number, taskType : string, taskId : number, comment : string)
    {
        try {
            console.log('ceva')
            // Make sure that task type is valid
            let type = new TaskType(taskType)

            // 1. Update the task to be flagged
            switch(type.value)
            {
                case 'approve':
                    await this.updateFlagOnApproveTask(taskId, staffId)
                    break
                case 'inappropriate-profile-report':
                case 'inappropriate-messages-report':
                case 'spam-or-scam-report':
                case 'other-report':
                    await this.updateFlagOnReportTask(taskId, staffId, type.value)
                    break
                case 'issue':
                    await this.updateFlagOnIssueTask(taskId, staffId)
                    break
                default: 
                    // this will never happen, cuz TaskType will sport it first
                    throw Error('Task type is not valid')
            }

            // 2. Save flag comment in the database
            let flag = Flag.build({
                staffId: staffId,
                taskType: type.value,
                taskId: taskId,
                comment: comment
            })
            await this._flagRepo.add(flag)

            return this._response.body()
        } catch(error) {
            console.log(error)
            throw error
        }
    }

    private async updateFlagOnApproveTask(taskId : number, staffId : number)
    {
        // Make sure you still have the lock before unflagging the task
        this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_APPROVE_FLAG_LOCKED'))
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_APPROVE_FLAG'))

        // Remove the task from the cached queue
        await this._waliQueue.remove(taskId)

        let queue = await this._lock.lockedTaskList.get()
        this.checkLockExpired(queue, taskId, staffId)

        let task = await this._approveRepo.findOne(taskId)

        // Set the key for the lock and remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)
        
        // Log the event
        await this.logStaffEvent(taskId, 'WALI_APPROVE_UNFLAG_TASK', staffId, task.memberId)

        // Update the flag state on the task
        await this._approveRepo.updateFlagged(taskId, false)
    }

    private async updateFlagOnReportTask(taskId : number, staffId : number, taskType : string)
    {
        // Make sure you still have the lock before unflagging the task
        this._lock.lockedTaskList.setKey(this._cacheKey.generate(`WALI_TASK_${ taskType.toUpperCase().split('-').join('_') }_FLAG_LOCKED`))
        this._waliQueue.setKey(this._cacheKey.generate(`WALI_QUEUE_${ taskType.toUpperCase().split('-').join('_') }_FLAG`))

        // Remove the task from the cached queue
        await this._waliQueue.remove(taskId)

        let queue = await this._lock.lockedTaskList.get()
        this.checkLockExpired(queue, taskId, staffId)

        let task = await this._reportRepo.findOne(taskId)

        // Set the key for the lock and remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event
        await this.logStaffEvent(taskId, `WALI_${ taskType.toUpperCase().split('-').join('_') }_UNFLAG_TASK`, staffId, task.id)

        // Update the flag state on the task
        await this._reportRepo.updateFlagged(taskId, false)
    }

    private async updateFlagOnIssueTask(taskId : number, staffId : number)
    {
        // Make sure you still have the lock before unflagging the task
        this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_ISSUE_FLAG_LOCKED'))
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_ISSUE_FLAG'))

        // Remove the task from the cached queue
        await this._waliQueue.remove(taskId)

        let queue = await this._lock.lockedTaskList.get()
        this.checkLockExpired(queue, taskId, staffId)

        let task = await this._issueRepo.findOne(taskId)

        // Set the key for the lock and remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event
        await this.logStaffEvent(taskId, 'WALI_ISSUE_UNFLAG_TASK', staffId, task.id)

        // Update the flag state on the task
        await this._issueRepo.updateFlagged(taskId, false)
    }

    private async logStaffEvent(taskId : number, eventCode : string, staffId : number, memberId : number) 
    {  
        let log = StaffLog.build({
            staffId: staffId,
            eventCode: eventCode,
            action: JSON.stringify({ taskId: taskId }),
            memberId: memberId
        })
        this._staffLogRepo.add(log)
    } 

    private checkLockExpired(queue : VirtualQueue[], taskId : number, staffId : number)
    {
        let found : boolean = false
        queue.forEach((lock)=> {
            if(lock.itemId === taskId && lock.staffId === staffId)
            {
                found = true
            }
        })

        if(!found)
        {
            throw new UnflagTaskError('Task lock has expired')
        }
    }
}