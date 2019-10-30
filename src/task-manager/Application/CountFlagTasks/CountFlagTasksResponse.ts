import BaseResponse from './../Shared/BaseResponse'


export default class CountFlagTasksResponse extends BaseResponse
{
    body(count : number, type : string)
    {
        return {
            count: count,
            flag: true,
            ticketType: type
        }
    }
}