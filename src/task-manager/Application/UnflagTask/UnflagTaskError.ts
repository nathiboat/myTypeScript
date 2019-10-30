export default class UnflagTaskError extends Error
{
    constructor(message : string)
    {
        super(message)
        this.name = 'UnflagTaskError'
    }
}