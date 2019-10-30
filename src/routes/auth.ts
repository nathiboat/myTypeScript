import express from 'express'
import container from './../container'

const router = express.Router()


router.post('/login', async (request, response)=> {

    let email = request.body.email
    let userAgent   = request.get('User-Agent')
    let ipAddress   = request.headers['x-forwarded-for'] || request.connection.remoteAddress
    let countryCode = request.headers['HTTP_CLOUDFRONT_VIEWER_COUNTRY'] || 'GB'

    if(!email) {
        return response.status(400).send('Missing required parameter: email')
    }

    try {
        let generatePassword = container.get('GeneratePasswordService')
        let result = await generatePassword.execute(email, ipAddress, userAgent, countryCode)
        return response.status(200).json(result)
    } catch(error) {
        console.log(error)
        return response.status(400).send(error.message)
    }
})

router.post('/validate-password', async (request, response)=> {

    let password    = request.body.password
    let userAgent   = request.get('User-Agent')
    let ipAddress   = request.headers['x-forwarded-for'] || request.connection.remoteAddress

    if(!password) {
        return response.status(400).send('Password parameter is mandatory')
    }

    try {
        let loginService = container.get('LoginStaffService')
        let result = await loginService.execute(password, ipAddress, userAgent)
        return response.status(200).json(result)
    } catch(error) {
        return response.status(400).send(error.message)
    }
})

export default router
