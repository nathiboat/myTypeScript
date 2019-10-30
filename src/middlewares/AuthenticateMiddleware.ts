import { Request, Response } from 'express'
import container from '../container'


const AuthenticateMiddleware = async (request : Request, response : Response, next : Function)=> {
    let tokenRaw = request.headers.authorization
    let path = request.originalUrl

    if(tokenRaw)
    {
        let token = tokenRaw.split(' ')[1]

        try
        {
            let authenticateStaff = container.get('AuthenticateStaffService')

            let result = await authenticateStaff.execute(token, path)

            if(!result)
            {
                return response.status(401).send('Staff not authenticated')
            }
            response.locals.staff = authenticateStaff.getAuthStaff()

            return next()

        } catch(error) {
            return response.status(401).send(error.message)
        }
    }
    return response.status(401).send('Unauthorized API request')
}

export default AuthenticateMiddleware
