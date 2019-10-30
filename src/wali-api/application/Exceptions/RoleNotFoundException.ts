export default class RoleNotFoundException extends Error
{
    constructor(message? : string)
    {
        super(message)
        this.name = 'RoleNotFoundException'
    }
}
