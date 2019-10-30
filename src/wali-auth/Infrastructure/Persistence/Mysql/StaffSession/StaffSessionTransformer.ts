
import { StaffSession } from './../../../../Domain/StaffSession'


type DatabaseRow = { [key: string]: any }


export default abstract class StaffLogTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            return StaffSession.build({
                id: row.id,
                staffId: row.staffID,
                ipAddress: row.ipAddress,
                ipCountryCode: row.ipCountryCode,
                userAgent: row.userAgent,
                passwordToken: row.passwordToken,
                lastActive: row.lastActive,
                created: row.created,
                updated: row.updated,
                state: row.state
            })
        })
    }

    static toRaw(model: StaffSession) 
    {
        return {
            id: model.id,
            staffId: model.staffId,
            ipAddress: model.ipAddress,
            ipCountryCode: model.ipCountryCode,
            userAgent: model.userAgent,
            passwordToken: model.passwordToken,
            lastActive: model.lastActive,
            created: model.created,
            updated: model.updated,
            state: model.state
        }
    }
}
