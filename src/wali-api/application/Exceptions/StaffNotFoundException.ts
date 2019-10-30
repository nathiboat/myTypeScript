export default class StaffNotFoundException extends Error
{
    constructor(message? : string)
    {
        super(message)
        this.name = 'StaffNotFoundException'
    }
}
