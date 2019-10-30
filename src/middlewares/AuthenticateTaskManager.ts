import { Request, Response } from 'express'
import container from '../container'

export const authAgentMiddleware = async (request : Request, response : Response, next : Function)=> {
    try {
        let tokenRaw = request.headers.authorization
        if(!tokenRaw)
        {
            throw Error('No token supplied')
        }

        let token = tokenRaw.split(' ')[1]

        let service = container.get('AuthenticateTaskManager')
        let result = await service.execute(token, 'agent')

        if(result === false)
        {
            throw Error('Unauthorized Agent task manager request')
        }
        response.locals.staff = result

        return next()
    } catch(error) {
        console.log(error)
        return response.status(401).send(error.message)
    }
}



export const authAdminMiddleware = async (request : Request, response : Response, next : Function)=> {
    try {
        let tokenRaw = request.headers.authorization
        if(!tokenRaw)
        {
            throw Error('No token supplied')
        }

        let token = tokenRaw.split(' ')[1]

        let service = container.get('AuthenticateTaskManager')
        let result = await service.execute(token, 'admin')

        if(result === false)
        {
            throw Error('Unauthorized Admin task manager request')
        }
        response.locals.staff = result

        return next()
    } catch(error) {
        console.log(error)
        return response.status(401).send(error.message)
    }
}

export const authAllMiddleware = async (request : Request, response : Response, next : Function)=> {
    try {
        let tokenRaw = request.headers.authorization
        if(!tokenRaw)
        {
            throw Error('No token supplied')
        }

        let token = tokenRaw.split(' ')[1]

        let service = container.get('AuthenticateTaskManager')
        let result = await service.execute(token)

        if(result === false)
        {
            throw Error('Unauthorized Task manager request')
        }
        response.locals.staff = result

        return next()
    } catch(error) {
        console.log(error)
        return response.status(401).send(error.message)
    }
}
