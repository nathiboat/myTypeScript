import express, { Request, Response } from 'express'
import Container from './../task-manager/Infrastructure/DependencyContainer/Container'
import { authMiddleware } from './../middlewares/NewAuthMiddleware'

const router = express.Router()

// Get the ticket counts
router.get('/count/:type', authMiddleware('task-manager'), async (request : Request, response : Response)=> {
    try {
        let type = request.params.type
        
        if(!type)
        {
            throw Error('Type param is not supplied')
        }
        let service = Container.get('CountTasks')
        let result = await service.execute(type)

        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        return response.status(400).send(error.message)
    }
})

router.get('/count/:type/flagged', authMiddleware('task-manager', 'admin'), async (request : Request, response : Response)=> {
    try {
        let type = request.params.type
        
        if(!type)
        {
            throw Error('Type param is not supplied')
        }
        let service = Container.get('CountFlagTasks')
        let result = await service.execute(type)

        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        return response.status(400).send(error.message)
    }
})


// Get the next Task
router.get('/:type', authMiddleware('task-manager'), async (request : Request, response : Response)=> {
    try {
        let staffId = response.locals.staff.id
        
        let type = request.params.type
        if(!type)
        {
            throw Error('Type param is not supplied')
        }

        let service : any
        let result : any
        switch(type)
        {
            case 'approve':
                service = Container.get('GetApproveQueue')
                result  = await service.execute(staffId)
                break
            case 'inappropriate-profile-report':
            case 'inappropriate-messages-report':
            case 'spam-or-scam-report':
            case 'other-report':
                service = Container.get('GetReportQueue')
                result  = await service.execute(staffId, type)
                break
            case 'issue':
                service = Container.get('GetIssueQueue')
                result  = await service.execute(staffId)
                break
            default:
                throw Error('Task type is not valid')
        }
        
        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        if(error.name === 'EmptyQueueError')
        {
            return response.status(200).send({
                message: error.message,
                error: true
            })
        }
        return response.status(400).send(error.message)
    }
})

router.get('/:type/flagged', authMiddleware('task-manager', 'admin'), async (request : Request, response : Response)=> {
    try {
        let staffId = response.locals.staff.id
        
        let type = request.params.type
        if(!type)
        {
            throw Error('Type param is not supplied')
        }

        let service : any
        let result : any
        switch(type)
        {
            case 'approve':
                service = Container.get('GetApproveFlagQueue')
                result  = await service.execute(staffId)
                break
            case 'inappropriate-profile-report':
            case 'inappropriate-messages-report':
            case 'spam-or-scam-report':
            case 'other-report':
                service = Container.get('GetReportFlagQueue')
                result  = await service.execute(staffId, type)
                break
            case 'issue':
                service = Container.get('GetIssueFlagQueue')
                result  = await service.execute(staffId)
                break
            default:
                throw Error('Task type is not valid')
        }
        
        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        if(error.name === 'EmptyQueueError')
        {
            return response.status(200).send({
                message: error.message,
                error: true
            })
        }
        return response.status(400).send(error.message)
    }
})


router.post('/action',authMiddleware('task-manager'), async (request : Request, response : Response)=> {
    try {
        if(!request.body.taskType)
        {
            throw Error('Task type is not supplied')
        }

        if(!request.body.taskId)
        {
            throw Error('Task id is not supplied')
        }
        let type    = request.body.taskType
        let id      = request.body.taskId
        let staffId = response.locals.staff.id
        // let staffId = 1

        let service = Container.get('ActionTask')
        let result = await service.execute(type, id, staffId)

        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        if(error.name === 'ActionTaskError')
        {
            return response.status(200).send({
                message: error.message,
                error: true
            })
        }
        return response.status(400).send(error.message)
    }
})


router.post('/flag', authMiddleware('task-manager', 'agent'), async (request : Request, response : Response)=> {
    try {
        if(!request.body.taskType)
        {
            throw Error('Task type is not supplied')
        }

        if(!request.body.taskId)
        {
            throw Error('Task id is not supplied')
        }

        if(!request.body.comment)
        {
            throw Error('Flag comment is not supplied')
        }

        let type    = request.body.taskType
        let id      = request.body.taskId
        let comment = request.body.comment
        // let staffId = 1
        let staffId = response.locals.staff.id
        
        let service = Container.get('FlagTask')
        let result = await service.execute(staffId, type, id, comment)

        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        if(error.name === 'FlagTaskError')
        {
            return response.status(200).send({
                message: error.message,
                error: true
            })
        }
        return response.status(400).send(error.message)
    }
})

router.post('/unflag', authMiddleware('task-manager', 'admin'), async (request : Request, response : Response)=> {
    try {
        if(!request.body.taskType)
        {
            throw Error('Task type is not supplied')
        }

        if(!request.body.taskId)
        {
            throw Error('Task id is not supplied')
        }

        if(!request.body.comment)
        {
            throw Error('Flag comment is not supplied')
        }

        let type    = request.body.taskType
        let id      = request.body.taskId
        let comment = request.body.comment
        let staffId = response.locals.staff.id
        // let staffId = 1
        
        let service = Container.get('UnflagTask')
        let result = await service.execute(staffId, type, id, comment)

        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        if(error.name === 'UnflagTaskError')
        {
            return response.status(200).send({
                message: error.message,
                error: true
            })
        }
        return response.status(400).send(error.message)
    }
})


router.get('/flag/comments', authMiddleware('task-manager'), async (request : Request, response : Response)=> {
    try {
        if(!request.query.type)
        {
            throw Error('Task type is not supplied')
        }
        if(!request.query.id)
        {
            throw Error('Task id is not supplied')
        }
        let type = request.query.type
        let id   = request.query.id

        let service = Container.get('GetFlagComments')
        let result = await service.execute(id, type)

        response.status(200).json(result)
    } catch(error) {
        console.log(error)
        return response.status(400).send(error.message)
    }
})


export default router
