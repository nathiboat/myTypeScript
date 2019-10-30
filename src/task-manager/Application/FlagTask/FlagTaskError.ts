export default class FlagTaskError extends Error
{
    constructor(message : string)
    {
        super(message)
        this.name = 'FlagTaskError'
    }
}