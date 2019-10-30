
type StaffPayload = {
    id: number,
    email: string,
    state: string,
    createdAt: any,
    updatedAt: any,
    name: string,
    password?: string,
    description?: string
}

export default class Staff 
{
    private constructor(
        public id: number,
        public email: string,
        public state: string,
        public createdAt: any,
        public updatedAt: any,
        public name: string,
        public password?: string,
        public description?: string)
    {
        //
    }

    static build(payload: StaffPayload) 
    {
        return new Staff(
            payload.id,
            payload.email,
            payload.state,
            payload.createdAt,
            payload.updatedAt,
            payload.name,
            payload.password,
            payload.description,
        )
    }

    isActive()
    {
        return this.state === 'OK' ? true : false
    }
}