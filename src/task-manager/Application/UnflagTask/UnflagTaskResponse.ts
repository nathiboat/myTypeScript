import BaseResponse from './../Shared/BaseResponse'


export default class UnflagTaskResponse extends BaseResponse
{
    body()
    {
        return {
            response: 'Task was successfully unflagged'
        }
    }
}