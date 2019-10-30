import { Context } from './../../'
import StaffSessionResult from './StaffSessionResult'
import { ISelectStaffSessionQuery } from './../../../../../domain'


export default class SelectStaffSessionQuery implements ISelectStaffSessionQuery
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(request : { [key : string] : string | number })
    {
        // 1. Get the keys
        let keys = Object.keys(request)
        let values = Object.values(request)

        let queryChunks = keys.map((key)=> {
            if(typeof request[key] == 'string')
            {
                return `${ key } = '${ request[key] }'`
            } else {
                return `${ key } = ${ request[key] }`
            }
        })

        this.context.connect()
        // 2. Mysql query here
        let rows =  await this.context.query(
            `SELECT * FROM staffSessions WHERE ${ queryChunks.join(' AND ') }`,
            [ values ])

        this.context.complete()
        return new StaffSessionResult(rows).retrieve()
    }
}
