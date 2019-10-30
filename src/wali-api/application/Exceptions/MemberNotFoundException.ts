export default class MemberNotFoundException extends Error
{
    constructor(message? : string)
    {
        super(message)
        this.name = 'MemberNotFoundException'
    }
}
