import { 
    Member, 
    IMemberRepository, 
    CacheKeyService, 
    IMemberApproveRepository,
    IStaffLogRepository, 
    StaffLog,
    ILock,
    IWaliQueueService
 } from './../../Domain'
import BaseResponse from './../Shared/BaseResponse'
import EmptyQueueError from './../Shared/EmptyQueueError'


export default class GetApproveQueue
{
    constructor(
        private _memberRepo : IMemberRepository,
        private _memberApproveRepo : IMemberApproveRepository,
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
            this._lock.lockedTaskList.setKey(this._cacheKey.generate('WALI_TASK_APPROVE_LOCKED'))
            this._waliQueue.setKey(this._cacheKey.generate('WALI_QUEUE_APPROVE'))
            this._lock.waliQueueLock.setKey(this._cacheKey.generate('WALI_QUEUE_APPROVE_LOCK'))
            
            // 2. Get all the current locked ids
            let queue = await this._lock.lockedTaskList.get()
            
            // 3. If the staff requesting a ticket already has one locked, then give me that one and add more time to it
            let pendingTickets = queue.filter((lockedTicket)=> {
                return lockedTicket.staffId === staffId
            })
            
            // Get the next ticket or the pending ticket
            let member : Member
            if(pendingTickets.length > 0)
            {   
                // We found a pending ticket id in the queue lets get the ticket and update the lock timer
                let pendingTicket = pendingTickets[0]
                member = await this._memberRepo.findOne(pendingTicket.itemId)

            } else {
                // We didn't find any pending ticket so we will get the next ticket
                let memberFromQueue = await this.getTaskFromQueue()
                if(memberFromQueue)
                {
                    member = memberFromQueue
                } else {
                    member = await this._lock.waliQueueLock.lock(async ()=> await this.fillQueueCallback())
                }
            }
            
            // If no more tasks into the queue
            if(!member)
            {
                throw new EmptyQueueError('No more tasks in the Approve queue')
            }

            // 5. Lock the current task picked for the staff - ASAP
            await this._lock.lockedTaskList.add({
                itemId: member.memberId,
                staffId: staffId
            })

            // 5. Get the date of the ticket
            let memberApprove = await this._memberApproveRepo.findOne(member.memberId)

            // 6. Create the response
            let response = this._response.body(member, memberApprove.lastUpdated)

            if(pendingTickets.length === 0)
            {
                 // 7. Log the staff log for WALI_APPROVE_VIEW
                let log = StaffLog.build({
                    staffId: staffId,
                    eventCode: 'WALI_APPROVE_VIEW',
                    action: JSON.stringify(response),
                    memberId: member.memberId
                })
                await this._staffLogRepo.add(log)
            }

            return response
        } catch(error) {
            console.log(error)
            throw error
        }
    }

    private async fillQueueCallback() : Promise<Member>
    {
        let taskQueue = await this._lock.lockedTaskList.get()
        let lockedTaskIds = taskQueue.map( task => task.itemId )
        let firstTask = await this._waliQueue.getFirst(lockedTaskIds)

        // Check if we have found a first id to get the task with or if it's null
        let member : Member
        if(!firstTask) {
            let members = await this._memberRepo.all()

            if (members.length === 0) {
                throw new EmptyQueueError('No more tasks in the Approve queue')
            }

            await this._waliQueue.push(members.map(member => member.memberId))
            member = members[0]
        } else {
            member = await this._memberRepo.findOne(firstTask)
        }

        return member
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
        return await this._memberRepo.findOne(firstTask)
    }
}