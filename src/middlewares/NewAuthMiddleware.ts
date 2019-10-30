import { Request, Response } from 'express'
import container from './../wali-auth/Infrastructure/DependencyContainer/Container'

export const authMiddleware = (product : string, role? : string)=> {
    return async (request : Request, response : Response, next : Function)=> {
        try {
            let tokenRaw = request.headers.authorization
            if(!tokenRaw)
            {
                throw Error('No token supplied')
            }

            let token = tokenRaw.split(' ')[1]

            let service = container.get('WaliAuthenticate')
            let result = await service.execute(token, product, role)

            if(result === false)
            {
                throw Error('Unauthorized Agent request')
            }
            response.locals.staff = result

            return next()
        } catch(error) {
            console.log(error)
            return response.status(401).send(error.message)
        }
    }
}
