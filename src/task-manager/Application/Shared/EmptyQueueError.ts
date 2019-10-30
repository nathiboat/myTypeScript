export default class EmptyQueueError extends Error
{
    constructor(message : string)
    {
        super(message)
        this.name = 'EmptyQueueError'
    }
}