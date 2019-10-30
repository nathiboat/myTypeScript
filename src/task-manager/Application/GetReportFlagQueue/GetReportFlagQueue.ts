import { 
    MemberReport, 
    IMemberReportRepository, 
    CacheKeyService, 
    IMemberRepository,
    StaffLog,
    IStaffLogRepository, 
    IMatchRepository,
    ILock,
    IWaliQueueService,
    TaskType
} from './../../Domain'
import BaseResponse from './../Shared/BaseResponse'
import EmptyQueueError from './../Shared/EmptyQueueError'


export default class GetReportFlagQueue
{
    private _validTaskTypes = [
        'inappropriate-profile-report',
        'inappropriate-messages-report',
        'spam-or-scam-report',
        'other-report'
    ]


    constructor(
        private _memberReportRepo : IMemberReportRepository,
        private _memberRepo : IMemberRepository,
        private _staffLogRepo : IStaffLogRepository,
        private _matchRepo : IMatchRepository,
        private _lock : ILock,
        private _waliQueue : IWaliQueueService,
        private _cacheKey : CacheKeyService,
        private _response : BaseResponse)
    {
        //
    }

    async execute(staffId : number, taskType : string)
    {
        try {
            // Validate the task type
            if(!this._validTaskTypes.includes(taskType))
            {
                throw Error(`Task type ${ taskType } is not valid`)
            }

            // 1. Generate and set up the correct key
            this._lock.lockedTaskList.setKey(this._cacheKey.generate(`WALI_TASK_${ taskType.toUpperCase().split('-').join('_') }_FLAG_LOCKED`))
            this._waliQueue.setKey(this._cacheKey.generate(`WALI_QUEUE_${ taskType.toUpperCase().split('-').join('_') }_FLAG`))
            this._lock.waliQueueLock.setKey(this._cacheKey.generate(`WALI_QUEUE_${ taskType.toUpperCase().split('-').join('_') }_FLAG_LOCK`))

            // 2. Get all the current locked ids
            let queue = await this._lock.lockedTaskList.get()
            
            // 3. If the staff requesting a ticket already has one locked, then give me that one and add more time to it
            let pendingTickets = queue.filter((lockedTicket)=> {
                return lockedTicket.staffId === staffId
            })

            let report : MemberReport
            if(pendingTickets.length > 0)
            {
                // We found a pending ticket id in the queue lets get the ticket and update the lock timer
                let pendingTicket = pendingTickets[0]
                report = await this._memberReportRepo.findOne(pendingTicket.itemId)

            } else {
                // 3. Get the first task excluding the locked ids
                let foundReportFromQueue = await this.getTaskFromQueue()
                if(foundReportFromQueue)
                {
                    report = foundReportFromQueue
                } else {
                    report = await this._lock.waliQueueLock.lock(async () => await this.fillQueueCallback(taskType))
                }
            }

            // If no more tasks into the queue
            if(!report)
            {
                throw new EmptyQueueError('No more tasks in the Report queue')
            }

            // 4. Lock the current task picked for the staff - ASAP
            await this._lock.lockedTaskList.add({
                itemId: report.id,
                staffId: staffId
            })

            // 5. Get the 2 members to be included in the response payload
            if(!report.memberId)
            {
                throw Error("Report does not have a reported member id")
            }
            if(!report.reportingMemberId)
            {
                throw Error("Report does not have a reporting member id")
            }
            let member         = await this._memberRepo.findOne(report.reportingMemberId)
            let reportedMember = await this._memberRepo.findOne(report.memberId)

            // Get the match id between the 2 members
            let match = await this._matchRepo.findByMembers([ member, reportedMember ])


            // 6. Create the response object
            let response = this._response.body(report, taskType, member, reportedMember, match)

            if(pendingTickets.length === 0)
            {
                // 7. Log the staff log for WALI_REPORT_VIEW
                let log = StaffLog.build({
                    staffId: staffId,
                    eventCode: `WALI_${ taskType.toUpperCase().split('-').join('_') }_FLAG_VIEW`,
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

    async fillQueueCallback(taskType : string) : Promise<MemberReport>
    {
        let taskQueue = await this._lock.lockedTaskList.get()
        let lockedTaskIds = taskQueue.map( task => task.itemId )
        let firstTask = await this._waliQueue.getFirst(lockedTaskIds)

        // Check if we have found a first id to get the task with or if it's null
        let report : MemberReport
        if(!firstTask) {

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
            // let reports = await this._memberReportRepo.allFlaggedReports()

            if (reports.length === 0) {
                throw new EmptyQueueError('No more tasks in the Report flag queue')
            }

            await this._waliQueue.push(reports.map(issue => issue.id))
            report = reports[0]
        } else {
            report = await this._memberReportRepo.findOne(firstTask)
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
        return await this._memberReportRepo.findOne(firstTask)
    }
}