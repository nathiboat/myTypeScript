
import { Staff } from './../../../../Domain'

type DatabaseRow = { [key: string]: any }



export default abstract class StaffTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            return Staff.build({
                id: row.id,
                email: row.emailAddress,
                state: row.state,
                createdAt: row.created,
                updatedAt: row.updated,
                name: row.name,
                password: row.passwordToken,
                description: row.title
            })
        })
    }

    static toRaw(model: Staff) 
    {
        return {
            id: model.id,
            email: model.email,
            state: model.state,
            created: model.createdAt,
            updated: model.updatedAt,
            name: model.name,
            passwordToken: model.password,
            title: model.description
        }
    }
}
