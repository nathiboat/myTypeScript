import BaseResponse from './../Shared/BaseResponse'


export default class CountTasksResponse extends BaseResponse
{
    body(count : number, type : string)
    {
        return {
            count: count,
            ticketType: type
        }
    }
}