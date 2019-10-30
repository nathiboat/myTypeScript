export default class Role
{
    private _id? : number

    private _productName : string

    private _roleName? : string

    private _roleDescription? : string

    private _created_at : Date

    private _updated_at : Date

    constructor(product_name: string, role_name?:string, created_at?: string, updated_at?: string, role_description?: string, id?: number, )
    {
        this._id = id
        this._productName = product_name
        this._roleName = role_name
        this._roleDescription = role_description
        this._created_at  = created_at ? new Date(created_at) : new Date()
        this._updated_at  = updated_at ? new Date(updated_at) : new Date()
    }

    get id()
    {
        return this._id
    }

    get productName()
    {
        return this._productName
    }

    get roleDescription()
    {
        return this._roleDescription
    }

    get roleName() {
        return this._roleName
    }

    get created()
    {
        return this._created_at
    }

    get updated()
    {
        return this._updated_at
    }

}
