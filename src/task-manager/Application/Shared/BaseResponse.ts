type Model = { [key : string] : any }

export default abstract class BaseResponse
{
    protected removeUnderscore(model : Model)
    {
        let response : Model = {}
        Object.keys(model).forEach((key)=> {
            let publicKey = key
            if(key.includes('_'))
            {
                publicKey = key.replace('_', '')
            }
            response[publicKey] = model[key]
        })
        return response
    }

    protected covertFieldsToString(model : Model, attributes : string[])
    {
        let response : Model = {}
        Object.keys(model).forEach((key)=> {
            response[key] = attributes.includes(key) ? model[key].toString() : model[key]
        })
        return response

    }

    abstract body(...payload : any) : { [key : string] : any }
}
