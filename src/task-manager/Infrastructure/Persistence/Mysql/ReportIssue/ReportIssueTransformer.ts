import { ReportIssue } from './../../../../Domain'

type DatabaseRow = { [key: string]: any }



export default abstract class ReportIssueTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            return ReportIssue.build({
                id: row.id,
                timeStamp: row.timeStamp,
                memberId: row.memberID,
                udid: row.udid,
                idfa: row.idfa,
                emailAddress: row.emailAddress,
                deviceOs: row.deviceOs,
                deviceModel: row.deviceModel,
                deviceVersion: row.deviceVersion,
                appVersion: row.appVersion,
                type: row.type,
                comment: row.comment,
                attachmentUrl: row.attachmentURL,
                source: row.source,
                consentedAtTimeStamp: row.consentedAtTimeStamp,
                actioned: row.actioned === 1 ? true : false,
                flagged: row.wali_flagged === 1 ? true : false
            })
        })
    }

    static toRaw(model: ReportIssue) {
        return {
            id: model.id,
            timeStamp: model.timeStamp,
            memberID: model.memberId,
            udid: model.udid,
            idfa: model.idfa,
            emailAddress: model.emailAddress,
            deviceOs: model.deviceOs,
            deviceModel: model.deviceModel,
            deviceVersion: model.deviceVersion,
            appVersion: model.appVersion,
            type: model.type,
            comment: model.comment,
            attachmentURL: model.attachmentUrl,
            source: model.source,
            consentedAtTimeStamp: model.consentedAtTimeStamp,
            actioned: model.actioned,
            wali_flagged: model.flagged
        }
    }
}
