
import { Flag, Staff } from './../../../../Domain'

type DatabaseRow = { [key: string]: any }


export default abstract class MemberTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            let staff = Staff.build({
                id: row.staff_id,
                email: row.emailAddress,
                state: row.state,
                createdAt: row.created,
                updatedAt: row.updated,
                name: row.name
            })

            let comment = Flag.build({
                id: row.id,
                staffId: row.staff_id,
                taskType: row.ticket_type,
                taskId: row.ticket_id,
                comment: row.comment,
                createdAt: row.flag_created_at
            })

            comment.addOwner(staff)

            return comment
        })
    }

    static toRaw(model: Flag) 
    {
        return {
            staff_id: model.staffId,
            ticket_type: model.taskType,
            ticket_id: model.taskId,
            comment: model.comment,
            created_at: model.createdAt
        }
    }
}
