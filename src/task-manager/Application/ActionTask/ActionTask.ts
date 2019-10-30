import { 
    TaskType,
    StaffLog,
    IStaffLogRepository,
    IMemberApproveRepository,
    IMemberReportRepository,
    IReportIssueRepository,
    Lock,
    WaliQueueService,
    CacheKeyService,
    VirtualQueue } from './../../Domain'
import BaseResponse from './../Shared/BaseResponse'
import ActionTaskError from './ActionTaskError'


export default class ActionTask
{
    constructor(
        private _memberApproveRepo : IMemberApproveRepository,
        private _memberReportRepo : IMemberReportRepository,
        private _reportIssueRepo : IReportIssueRepository,
        private _staffLogRepo : IStaffLogRepository,
        private _lock : Lock,
        private _waliQueue : WaliQueueService,
        private _cacheKey : CacheKeyService,
        private _response : BaseResponse)
    {
        //
    }

    async execute(taskType : string, id : number, staffId : number)
    {
        try {
            // Make sure that task type is valid
            let type = new TaskType(taskType)

            // 1. Action the task
            switch(type.value)
            {
                case 'approve':
                    await this.actionApproveTickets(id, staffId)
                    break
                case 'inappropriate-profile-report':
                case 'inappropriate-messages-report':
                case 'spam-or-scam-report':
                case 'other-report':
                    await this.actionReportTickets(id, staffId, type.value)
                    break
                case 'issue':
                    await this.actionReportIssueTickets(id, staffId)
                    break
                default:
                    throw Error('Ticket type is not valid')
            }

            return this._response.body()
        } catch(error) {
            console.log(error)
            throw error
        }
    }

    private async actionApproveTickets(taskId : number, staffId : number)
    {   
        // Check if I, as a staff, still have the lock
        this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_APPROVE_LOCKED'))
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_APPROVE'))

        // Take id from the lock list
        await this._waliQueue.remove(taskId)

        let queue = await this._lock.lockedTaskList.get()
        this.checkLockExpired(queue, taskId, staffId)

        // Get the member ID of the task
        let task = await this._memberApproveRepo.findOne(taskId)

        // Update the task in the database
        await this._memberApproveRepo.updateActioned(taskId, true)
        
        // Remove the task from the lock - ASAP
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event in the staffLogs
        await this.logStaffEvent(taskId, 'WALI_APPROVE_ACTION_TASK', staffId, task.memberId)
    }

    private async actionReportTickets(taskId : number, staffId : number, taskType : string)
    {
        // Check if I, as a staff, still have the lock
        this._lock.lockedTaskList.setKey(this._cacheKey.generate(`WALI_TASK_${ taskType.toUpperCase().split('-').join('_') }_LOCKED`))
        this._waliQueue.setKey(this._cacheKey.generate(`WALI_QUEUE_${ taskType.toUpperCase().split('-').join('_') }`))

        // Take id from the lock list
        await this._waliQueue.remove(taskId)

        let queue = await this._lock.lockedTaskList.get()
        this.checkLockExpired(queue, taskId, staffId)

        // Get the member ID of the task
        let task = await this._memberReportRepo.findOne(taskId)
        
        // Check if the task is already actioned
        if(task.actioned)
        {
            throw new ActionTaskError('Task is already approved')
        }

        // Update the task in the database
        await this._memberReportRepo.updateActioned(taskId, true)

        // Remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event in the staffLogs
        await this.logStaffEvent(taskId, `WALI_${ taskType.toUpperCase().split('-').join('_') }_ACTION_TASK`, staffId, task.memberId)
    }

    private async actionReportIssueTickets(taskId : number, staffId : number)
    {
        // Check if I, as a staff, still have the lock
        this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_ISSUE_LOCKED'))
        this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_ISSUE'))

        await this._waliQueue.remove(taskId)

        let queue = await this._lock.lockedTaskList.get()
        this.checkLockExpired(queue, taskId, staffId)

        // Get the member ID of the task
        let task = await this._reportIssueRepo.findOne(taskId)

        // Check if the task is already actioned
        if(task.actioned)
        {
            throw new ActionTaskError('Task is already approved')
        }
        
        // Update the task in the database
        await this._reportIssueRepo.updateActioned(taskId, true)

        // Remove the task from the lock
        await this._lock.lockedTaskList.removeItem(taskId)

        // Log the event in the staffLogs
        await this.logStaffEvent(taskId, 'WALI_ISSUE_ACTION_TASK', staffId, task.memberId)
    }

    private async logStaffEvent(taskId : number, eventCode : string, staffId : number, memberId : number) 
    {   
        // Log the WALI_ACTION_TASK + TYPE event for this task
        let log = StaffLog.build({
            staffId: staffId,
            eventCode: eventCode,
            action: JSON.stringify({ taskId: taskId }),
            memberId: memberId
        })
        await this._staffLogRepo.add(log)
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
            throw new ActionTaskError('Task lock has expired')
        }
    }
}