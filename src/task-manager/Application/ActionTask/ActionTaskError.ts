export default class ActionTaskError extends Error
{
    constructor(message : string)
    {
        super(message)
        this.name = 'ActionTaskError'
    }
}