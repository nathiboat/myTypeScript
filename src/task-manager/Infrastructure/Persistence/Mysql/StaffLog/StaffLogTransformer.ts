
import { StaffLog } from './../../../../Domain'

type DatabaseRow = { [key: string]: any }


export default abstract class StaffLogTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            return StaffLog.build({
                id: row.id,
                staffId: row.staffId,
                eventCode: row.eventCode,
                timeStamp: row.timeStamp,
                memberId: row.memberId,
                action: row.action,
                ipAddress: row.ipAddress,
                ipCountryCode: row.ipCountryCode
            })
        })
    }

    static toRaw(model: StaffLog) 
    {
        return {
            id: model.id,
            staffId: model.staffId,
            eventCode: model.eventCode,
            timeStamp: model.timeStamp,
            memberId: model.memberId,
            action: model.action,
            ipAddress: model.ipAddress,
            ipCountryCode: model.ipCountryCode
        }
    }
}
