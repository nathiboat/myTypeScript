import { Staff } from '../../../../../domain/Staff'

export default class StaffMap
{
    static deconstruct(staff : Staff) : { [key : string] : any }
    {
        return {
            name: staff.name,
            passwordToken: staff.password,
            emailAddress: staff.email,
            title: staff.description,
            state: staff.state,
            created: staff.created,
            updated: staff.updated
        }
    }
}
