import Role from './../Role/Role'

type StaffPayload = {
    id: number,
    email: string,
    state: string,
    createdAt: any,
    updatedAt: any,
    name: string,
    password?: string,
    description?: string
    roles? : Role[]
}

export default class Staff 
{
    public roles : Role[] = []

    private constructor(
        public id: number,
        public email: string,
        public state: string,
        public createdAt: any,
        public updatedAt: any,
        public name: string,
        public password?: string,
        public description?: string,
        roles? : Role[]
    )
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
            payload.roles
        )
    }

    isActive()
    {
        return this.state === 'OK' ? true : false
    }

    addRole(role : Role)
    {
        this.roles.push(role)
    }
}