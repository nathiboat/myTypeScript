import BaseResponse from './../../BaseResponse'
import { Member, Question, Image } from './../../../domain'


export default class GenerateQuestionsResponse extends BaseResponse
{
    body(member : Member, questions : Question[])
    {
        let response : { [key: string] : any } = {}

        response.member = member.hashId

        response.questions = questions.map((question)=> {
            return this.removeUnderscore(question)
        })

        return response
    }
}
