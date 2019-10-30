import BaseResponse from './../Shared/BaseResponse'



export default class FlagTaskResponse extends BaseResponse
{
    body()
    {
        return {
            response: 'Task was successfully flagged'
        }
    }
}