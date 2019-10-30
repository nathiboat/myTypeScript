type RolePayload = {
    id: number,
    productName: string,
    roleName: string,
    createdAt?: string,
    updatedAt?: string,
    roleDescription?: string,
}

export default class Role
{   
    public createdAt : Date

    public updatedAt : Date

    constructor(
        public productName: string, 
        public roleName?:string, 
        createdAt?: string, 
        updatedAt?: string, 
        public roleDescription?: string, 
        public id?: number, )
    {
        this.createdAt  = createdAt ? new Date(createdAt) : new Date()
        this.updatedAt  = updatedAt ? new Date(updatedAt) : new Date()
    }

    static build(payload: RolePayload) 
    {
        return new Role(
            payload.productName,
            payload.roleName,
            payload.createdAt,
            payload.updatedAt,
            payload.roleDescription,
            payload.id
        )
    }

}
