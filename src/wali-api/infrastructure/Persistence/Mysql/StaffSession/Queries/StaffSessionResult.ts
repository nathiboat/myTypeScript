import { StaffSessionFactory, StaffSession } from './../../../../../domain'


export default class StaffSessionResult
{
    private rows : { [key : string] : any }[]

    constructor(rows : { [key : string] : any }[])
    {
        this.rows = rows
    }

    retrieve() : StaffSession[]
    {
        return this.rows.map((row)=> {
            return StaffSessionFactory.build({
                staffId: row.staffID, 
                passwordToken: row.passwordToken, 
                ipAddress: row.ipAddress, 
                ipCountryCode: row.ipCountryCode, 
                userAgent: row.userAgent, 
                lastActive: row.lastActive, 
                created: row.created, 
                updated: row.updated, 
                state: row.state,
                id: row.id
            })
        })
    }
}
