import { Container } from 'typescript-dependency-injection'
import {
    Context,
    MemberRepository,
    MemberApproveRepository,
    MemberReportRepository,
    ReportIssueRepository,
    StaffLogRepository,
    FlagRepository,
    MatchRepository } from './../../Infrastructure/Persistence/Mysql'
import { RedisCache } from './../../Infrastructure/Cache/RedisCache'
import {
    CountTasks,
    CountTasksResponse,
    GetApproveQueue,
    GetApproveQueueResponse,
    GetReportQueue,
    GetReportQueueResponse,
    GetIssueQueue,
    GetIssueQueueResponse,
    ActionTask,
    ActionTaskResponse,
    FlagTask,
    FlagTaskResponse,
    UnflagTask,
    UnflagTaskResponse,
    GetFlagComments,
    GetFlagCommentsResponse,
    GetApproveFlagQueue,
    GetApproveFlagQueueResponse,
    GetReportFlagQueue,
    GetReportFlagQueueResponse,
    GetIssueFlagQueue,
    GetIssueFlagQueueResponse,
    CountFlagTasks,
    CountFlagTasksResponse } from './../../Application'
import {
    LockedTaskListService,
    CacheKeyService,
    WaliQueueLockService,
    WaliQueueService,
    Lock } from './../../Domain'


let container = new Container()


if(!process.env.MYSQL_HOST) { throw Error('Env values not set for MYSQL_HOST') }
if(!process.env.MYSQL_DATABASE) { throw Error('Env values not set for MYSQL_DATABASE') }
if(!process.env.MYSQL_USER) { throw Error('Env values not set for MYSQL_USER') }
if(!process.env.MYSQL_PASSWORD) { throw Error('Env values not set for MYSQL_PASSWORD') }
if(!process.env.MYSQL_PORT) { throw Error('Env values not set for MYSQL_PORT') }


// Register dependencies into the container here

container.resolve('Context', ()=> {
    return new Context(
        process.env.MYSQL_HOST!,
        process.env.MYSQL_DATABASE!,
        process.env.MYSQL_USER!,
        process.env.MYSQL_PASSWORD!,
        parseInt(process.env.MYSQL_PORT!))
})

if(!process.env.REDIS_HOST) { throw Error('Env values not set for REDIS_HOST') }
if(!process.env.REDIS_PORT) { throw Error('Env values not set for REDIS_PORT') }

container.register(RedisCache)
        .dependsOnString(process.env.REDIS_HOST)
        .dependsOnNumber(parseInt(process.env.REDIS_PORT))

if(!process.env.REDIS_PREFIX) { throw Error('Env values not set for REDIS_PREFIX') }

container.register(CacheKeyService)
        .dependsOnString(process.env.REDIS_PREFIX)

container.register(WaliQueueLockService)
        .dependsOnClass('RedisCache')
        .dependsOnNumber(5 * 60) // seconds, prod 5
        .dependsOnNumber(10) // retry count
        .dependsOnNumber(800) // sleep between retrys
        

// Register the LockedTaskListService
container.register(LockedTaskListService)
        .dependsOnClass('RedisCache')
        .dependsOnNumber(5 * 60) // seconds , prod 5 minutes

container.register(WaliQueueService)
        .dependsOnClass('RedisCache')
        .dependsOnNumber(30 * 60) // seconds, prod 30 minutes

container.register(Lock)
        .dependsOnClass('LockedTaskListService')
        .dependsOnClass('WaliQueueLockService')


container.register(MemberRepository)
        .dependsOnClass('Context')

container.register(MemberApproveRepository)
        .dependsOnClass('Context')

container.register(MemberReportRepository)
        .dependsOnClass('Context')

container.register(ReportIssueRepository)
        .dependsOnClass('Context')

container.register(StaffLogRepository)
        .dependsOnClass('Context')

container.register(FlagRepository)
        .dependsOnClass('Context')

container.register(MatchRepository)
        .dependsOnClass('Context')

container.register(CountTasks)
        .dependsOnClass('MemberRepository')
        .dependsOnClass('MemberReportRepository')
        .dependsOnClass('ReportIssueRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new CountTasksResponse())

container.register(CountFlagTasks)
        .dependsOnClass('MemberRepository')
        .dependsOnClass('MemberReportRepository')
        .dependsOnClass('ReportIssueRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new CountFlagTasksResponse())

container.register(GetApproveQueue)
        .dependsOnClass('MemberRepository')
        .dependsOnClass('MemberApproveRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new GetApproveQueueResponse())

container.register(GetReportQueue)
        .dependsOnClass('MemberReportRepository')
        .dependsOnClass('MemberRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('MatchRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new GetReportQueueResponse())

container.register(GetIssueQueue)
        .dependsOnClass('ReportIssueRepository')
        .dependsOnClass('MemberRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new GetIssueQueueResponse())

container.register(ActionTask)
        .dependsOnClass('MemberApproveRepository')
        .dependsOnClass('MemberReportRepository')
        .dependsOnClass('ReportIssueRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new ActionTaskResponse())

container.register(FlagTask)
        .dependsOnClass('FlagRepository')
        .dependsOnClass('MemberApproveRepository')
        .dependsOnClass('MemberReportRepository')
        .dependsOnClass('ReportIssueRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new FlagTaskResponse())

container.register(UnflagTask)
        .dependsOnClass('FlagRepository')
        .dependsOnClass('MemberApproveRepository')
        .dependsOnClass('MemberReportRepository')
        .dependsOnClass('ReportIssueRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new UnflagTaskResponse())


container.register(GetFlagComments)
        .dependsOnClass('FlagRepository')
        .dependsOn(()=> new GetFlagCommentsResponse())

container.register(GetApproveFlagQueue)
        .dependsOnClass('MemberRepository')
        .dependsOnClass('MemberApproveRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new GetApproveFlagQueueResponse())

container.register(GetReportFlagQueue)
        .dependsOnClass('MemberReportRepository')
        .dependsOnClass('MemberRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('MatchRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new GetReportFlagQueueResponse())

container.register(GetIssueFlagQueue)
        .dependsOnClass('ReportIssueRepository')
        .dependsOnClass('MemberRepository')
        .dependsOnClass('StaffLogRepository')
        .dependsOnClass('Lock')
        .dependsOnClass('WaliQueueService')
        .dependsOnClass('CacheKeyService')
        .dependsOn(()=> new GetIssueFlagQueueResponse())



export default container
