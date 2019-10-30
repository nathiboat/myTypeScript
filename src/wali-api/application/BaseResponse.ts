export default abstract class BaseResponse
{
    protected removeUnderscore(model : { [key : string] : any })
    {
        let response : { [key : string] : any } = {}
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

    abstract body(...payload : any) : { [key : string] : any }
}
