import BaseResponse from './../Shared/BaseResponse'
import { 
    LockedTaskListService,
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
    IWaliQueueService, 
    ILock } from './../../Domain'
import FlagTaskError from './FlagTaskError'


export default class FlagTask
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
                    // this will never happen, cuz TaskType will spot it first
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
        // Make sure you still have the lock before flagging the task
        this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_APPROVE_LOCKED'))
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_APPROVE'))

        // Remove the task from the queue
        await this._waliQueue.remove(taskId)

        let list = await this._lock.lockedTaskList.get()
        this.checkLockExpired(list, taskId, staffId)
        
        // Get the task
        let task = await this._approveRepo.findOne(taskId)

        if(task.flagged)
        {
            throw new FlagTaskError('Task is already flagged')
        }

        // Set the key for the lock and remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event
        await this.logStaffEvent(taskId, 'WALI_APPROVE_FLAG_TASK', staffId, task.memberId)

        // Get the current task from the repo
        await this._approveRepo.updateFlagged(taskId, true)
    }

    private async updateFlagOnReportTask(taskId : number, staffId : number, taskType : string)
    {
        // Make sure you still have the lock before flagging the task
        this._lock.lockedTaskList.setKey(this._cacheKey.generate(`WALI_TASK_${ taskType.toUpperCase().split('-').join('_') }_LOCKED`))
        this._waliQueue.setKey(this._cacheKey.generate(`WALI_QUEUE_${ taskType.toUpperCase().split('-').join('_') }`))

        // Remove the task from the queue
        await this._waliQueue.remove(taskId)

        let list = await this._lock.lockedTaskList.get()
        this.checkLockExpired(list, taskId, staffId)
        
        // Get the task
        let task = await this._reportRepo.findOne(taskId)

        if(task.flagged)
        {
            throw new FlagTaskError('Task is already flagged')
        }

        // Set the key for the lock and remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event
        await this.logStaffEvent(taskId, `WALI_${ taskType.toUpperCase().split('-').join('_') }_FLAG_TASK`, staffId, task.memberId)

        await this._reportRepo.updateFlagged(taskId, true)
    }

    private async updateFlagOnIssueTask(taskId : number, staffId : number)
    {
        // Make sure you still have the lock before flagging the task
        this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_ISSUE_LOCKED'))
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_ISSUE'))

        // Remove the task from the queue
        await this._waliQueue.remove(taskId)

        let list = await this._lock.lockedTaskList.get()
        this.checkLockExpired(list, taskId, staffId)

        // Get the task
        let task = await this._issueRepo.findOne(taskId)

        if(task.flagged)
        {
            throw new FlagTaskError('Task is already flagged')
        }

        // Set the key for the lock and remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event
        await this.logStaffEvent(taskId, 'WALI_ISSUE_FLAG_TASK', staffId, task.memberId)

        await this._issueRepo.updateFlagged(taskId, true)
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

    private checkLockExpired(list : VirtualQueue[], taskId : number, staffId : number)
    {
        let found : boolean = false
        list.forEach((lock)=> {
            if(lock.itemId === taskId && lock.staffId === staffId)
            {
                found = true
            }
        })

        if(!found)
        {
            throw new FlagTaskError('Task lock has expired')
        }
    }
}