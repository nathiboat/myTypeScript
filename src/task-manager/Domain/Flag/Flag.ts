import Staff from './../Staff/Staff'

type FlagPayload = {
    id? : number,
    staffId : number,
    taskType : string,
    taskId : number,
    comment : string,
    createdAt? : string
}

export default class Flag
{
    private _createdAt? : Date

    private _owner? : Staff

    private constructor(
        public staffId : number,
        public taskType : string,
        public taskId : number,
        public comment : string,
        createdAt? : string,
        public id? : number)
    {
        this._createdAt = createdAt ? new Date(createdAt) : new Date()
    }

    static build(payload: FlagPayload) 
    {
        return new Flag(
            payload.staffId,
            payload.taskType,
            payload.taskId,
            payload.comment,
            payload.createdAt,
            payload.id
        )
    }

    get createdAt()
    {
        return this._createdAt
    }

    addOwner(staff : Staff)
    {
        this._owner = staff
    }

    getOwner() : Staff
    {
        if(this._owner === undefined)
        {
            throw Error('Flag has no owner')
        }
        return this._owner
    }

}
