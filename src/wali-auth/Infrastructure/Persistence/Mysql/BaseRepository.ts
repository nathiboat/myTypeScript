import Context from './Context'


export default abstract class BaseRepository<T>
{
    protected _context : Context


    constructor(context : Context)
    {
        this._context = context
    }

    create(model : T) : Promise<null> 
    {
        throw new Error('Method not implemented.')
    }

    update(id : number, model : T) : Promise<null> 
    {
        throw new Error('Method not implemented.')
    }

    delete(id : number) : Promise<null> 
    {
        throw new Error('Method not implemented.')
    }

    all() : Promise<T[]> 
    {
        throw new Error('Method not implemented.')
    }

    findOne(id : number) : Promise<T> 
    {
        throw new Error('Method not implemented.')
    }
}