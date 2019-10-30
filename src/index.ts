require('appoptics-apm')
import express from 'express'
import body from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import path from 'path'

dotenv.config({ path: __dirname + '/../.env' })

import { router } from './routes'

const app = express()

app.use(cors())

// ! Fix CORS
var whitelist = ['*']
var corsOptions = {
    origin: function(origin : any, callback : Function) {
        if(whitelist.indexOf(origin) !== -1) 
        {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

// app.use(cors(corsOptions))
app.use(cors())
app.use(body.json())
app.use(body.urlencoded({
    extended: false
}))


app.get('/', (request, response) => {
    response.send('It works')
})

app.use('/shortcut', router.shortcut())
app.use('/auth', router.auth())
app.use('/staff', router.staff())
app.use('/role', router.role())
app.use('/member', router.member())
app.use('/tasks', router.tasks())
app.use('/static', express.static(path.join(__dirname, '..', 'assets')))


app.listen(3003, () => {
    console.log('App started on port 3003')
})
