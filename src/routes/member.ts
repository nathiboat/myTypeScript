import express from 'express'
import container from '../container'
import { AuthenticateMiddleware } from './../middlewares'

const router = express.Router()

router.get('/approve', AuthenticateMiddleware, async (request, response) => {
    try {
        let service = container.get('GenerateQuestionsForMembers')
        let staffId = response.locals.staff.id

        let questions = await service.execute(staffId)

        return response.status(200).json(questions)
    } catch (error) {
        return response.status(400).send(error.message);
    }
})

router.get('/approve/pending', AuthenticateMiddleware, async (request, response) => {
    try {
        let service = container.get('GetPendingApprovalNumberService')
        let numberOfApproval = await service.execute()

        return response.status(200).json(numberOfApproval)
    } catch (error) {
        return response.status(400).send(error.message);
    }
})

router.post('/approve', AuthenticateMiddleware, async (request, response) => {
    try {
        let answers      = request.body.answers
        let memberHashId = request.body.memberHashId
        let staffId      = response.locals.staff.id

        if (!memberHashId) {
            return response.status(400).send('Missing required memberHashId')
        }

        if (!answers) {
            return response.status(400).send('Missing required answers')
        }

        let service = container.get('ApproveMemberService')
        let approvalResponse = await service.execute(memberHashId, answers, staffId)

        return response.status(200).json(approvalResponse)
    } catch (error) {
        console.log(error)
        return response.status(400).send(error.message);
    }
})

router.post('/flag', AuthenticateMiddleware, async (request, response) => {
    let memberHashId = request.body.memberHashId

    if(!memberHashId) {
        return response.status(400).send('Member hash id is mandatory');
    }

    try {
        let service = container.get('FlagMemberService')
        let result = await service.execute(memberHashId)

        return response.status(200).json(result)
    } catch (error) {
        return response.status(400).send(error.message)
    }
})

// router.post('/block', AuthenticateMiddleware, async (request, response) => {
//     let id = request.body.id

//     if(!id) {
//         return response.status(400).send('Parameter id is mandatory');
//     }

//     try {
//         let service = container.get('PermanentlyBlockedService');
//         let result = await service.execute(id);

//         return response.status(200).json(result)
//     } catch (error) {
//         console.log(error)
//         return response.status(400).send(error.message);
//     }
// })

// router.post('/unblock', AuthenticateMiddleware, async (request, response) => {
//     let id = request.body.id

//     if(!id) {
//         return response.status(400).send('Parameter id is mandatory');
//     }

//     try {
//         let service = container.get('UnblockService');
//         let result = await service.execute(id);

//         return response.status(200).json(result)
//     } catch (error) {
//         console.log(error)
//         return response.status(400).send(error.message);
//     }
// })


export default router
