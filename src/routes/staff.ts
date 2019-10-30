import express from 'express'
import container from '../container'
import { AuthenticateMiddleware } from './../middlewares'

const router = express.Router()


router.post('/store', AuthenticateMiddleware, async (request, response)=> {

    let roleIds     = request.body.roles
    let name        = request.body.name
    let email       = request.body.email
    let description = request.body.description

    if(roleIds.length < 1)
    {
        return response.status(400).send('Parameter roles should be longer then 0');
    }

    if(!name)
    {
        return response.status(400).send('Parameter name is mandatory');
    }

    if(!email)
    {
        return response.status(400).send('Parameter email is mandatory');
    }

    try {
        let service = container.get('RegisterStaffService')
        let result = await service.execute(roleIds, name, email, description)

        response.status(200).send(result)
    } catch(error) {
        console.log(error)
        response.status(500).json(error)
    }
})


router.post('/update', AuthenticateMiddleware, async (request, response)=> {

    let roleIds     = request.body.roles
    let id          = request.body.id
    let name        = request.body.name
    let email       = request.body.email
    let description = request.body.description

    if(!roleIds)
    {
        return response.status(400).send('Parameter roleIds is mandatory');
    }

    if(!id)
    {
        return response.status(400).send('Parameter id is mandatory');
    }

    if(!name)
    {
        return response.status(400).send('Parameter name is mandatory');
    }

    if(!email)
    {
        return response.status(400).send('Parameter email is mandatory');
    }

    try {
        let service = container.get('UpdateStaffService')
        let result = await service.execute(roleIds, id, name, email, description)

        response.status(200).send(result)
    } catch(error) {
        console.log(error)
        response.status(500).json(error)
    }
})



router.get('/collection', AuthenticateMiddleware, async (request, response)=> {

    try {
        let service = container.get('GetStaffCollectionService')
        let result = await service.execute()

        response.status(200).send(result)
    } catch(error) {
        response.status(500).json(error)
    }
})

router.post('/search', async (request, response)=> {

    let token = request.body.token

    if (!token) {
        return response.status(400).send('Parameter token is mandatory');
    }

    try {
        let service = container.get('GetLoggedInStaffService')
        let result = await service.execute(token)

        response.status(200).send(result)
    } catch(error) {
        console.log(error)
        response.status(500).json(error)
    }
})

router.delete('/remove', AuthenticateMiddleware, async (request, response)=> {
    let id = request.query.id
    
    if(!id)
    {
        return response.status(400).send('Parameter id is mandatory');
    }

    try {
        let service = container.get('RemoveStaffService')
        let result = await service.execute(id)

        response.status(200).send(result)
    } catch(error) {
        response.status(500).json(error)
    }
})

export default router
