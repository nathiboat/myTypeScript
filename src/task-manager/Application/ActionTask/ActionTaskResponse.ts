import BaseResponse from './../Shared/BaseResponse'


export default class ActionTaskResponse extends BaseResponse
{
    body()
    {
        return {
            response: 'Task was successfully actioned'
        }
    }
}