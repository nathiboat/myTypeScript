import { IFlagRepository, TaskType  } from './../../Domain'
import BaseResponse from './../Shared/BaseResponse'


export default class GetFlagComments
{
    constructor(
        private _flagRepo : IFlagRepository,
        private _response : BaseResponse)
    {
        //
    }

    async execute(taskId : number, taskType : string)
    {
        try {
            let comments = await this._flagRepo.findByTask(new TaskType(taskType), taskId)
            
            
            return this._response.body(comments)
        } catch(error) {
            console.log(error)
            throw error
        }
    }
}