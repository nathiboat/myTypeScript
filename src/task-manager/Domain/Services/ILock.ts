import IAssignedTaskListService from './ILockedTaskListService'
import IWaliQueueLockService from './IWaliQueueLockService'


export default interface ILock
{
    readonly lockedTaskList : IAssignedTaskListService

    readonly waliQueueLock : IWaliQueueLockService
}