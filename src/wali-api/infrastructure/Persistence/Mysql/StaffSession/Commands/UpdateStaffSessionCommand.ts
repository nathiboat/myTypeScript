import { Context } from '../../index'
import StaffSessionMap from './StaffSessionMap'
import { IUpdateStaffSessionCommand, StaffSession } from './../../../../../domain'

// This will not update the created timestamp


export default class UpdateStaffSessionCommand implements IUpdateStaffSessionCommand
{
    private context : Context

    constructor(context : Context)
    {
        this.context = context
    }

    async execute(staffSession : StaffSession)
    {
        this.context.connect()
        
        let filteredValues : any[] = []
        Object.keys(StaffSessionMap.deconstruct(staffSession)).forEach((key)=> {
            if(key !== 'created')
            {
                filteredValues.push(StaffSessionMap.deconstruct(staffSession)[key])
            }
        })

        let pairs = Object.keys(StaffSessionMap.deconstruct(staffSession)).filter((key)=> {
            return key !== 'created'
        }).map((key)=> {
            return `${ key } = ?`
        }).join(',')
    
        await this.context.query(
            `UPDATE staffSessions
             SET ${ pairs }
             WHERE id = ?`, [ ...filteredValues, staffSession.id])
        this.context.complete()
        return null
    }
}
