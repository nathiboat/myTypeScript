import ILockedTaskListService from './ILockedTaskListService'
import IWaliQueueLockService from './IWaliQueueLockService'


export default class Lock
{
    constructor(
        private _lockedTaskList : ILockedTaskListService,
        private _waliQueueLock : IWaliQueueLockService)
    {
        //
    }

    get lockedTaskList()
    {
        return this._lockedTaskList
    }

    get waliQueueLock()
    {
        return this._waliQueueLock
    }
}