import BaseResponse from './../Shared/BaseResponse'
import { Flag } from './../../Domain'


export default class GetFlagCommentsResponse extends BaseResponse
{
    body(comments: Flag[])
    {
        return comments.map((comment)=> {
                let owner = comment.getOwner()
                return {
                    comment: comment.comment,
                    created: comment.createdAt,
                    owner: {
                        id: owner.id,
                        name: owner.name,
                        active: owner.isActive()
                    }
                }
            })
        
    }
}