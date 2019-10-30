import { IUpdateStaffCommand, Staff } from './../../wali-api/domain'


export default class LocalUpdateStaffCommand implements IUpdateStaffCommand
{
    async execute(staff : Staff)
    {
        return null
    }
}
