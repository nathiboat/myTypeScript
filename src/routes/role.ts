import express, { Request, Response } from 'express'
import container from '../container'
import { AuthenticateMiddleware } from './../middlewares'


const router = express.Router()


router.post('/store', AuthenticateMiddleware, async function (request : Request, response : Response) {

    let name          = request.body.name
    let description   = request.body.description
    let productName   = request.body.productName

    if (!name) {
        return response.status(400).send('Parameter name is mandatory');
    }

    if (!productName) {
        return response.status(400).send('Parameter productName is mandatory');
    }

    try {
        let service = container.get('CreateRoleService');
        let result = await service.execute(name, productName, description);

        response.status(200).json(result);
    } catch(error) {
        console.log(error)
        return response.status(400).send(error.message);
    }
})

router.get('/collection', AuthenticateMiddleware, async function (request : Request, response : Response) {
    try {
        let service = container.get('GetRolesService');
        let roles = await service.execute();

        response.status(200).json(roles)
    } catch(error) {
        console.log(error)
        return response.status(400).send(error.message);
    }
})

router.delete('/remove', AuthenticateMiddleware, async (request, response)=> {
    let roleId = request.query.roleId

    if(!roleId) {
        return response.status(400).send('Parameter roleId is mandatory');
    }

    try {
        let service = container.get('RemoveRoleService')
        let result : boolean = await service.execute(roleId)

        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        return response.status(400).send(error.message)
    }
})

export default router
