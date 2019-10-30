import nodemailer from 'nodemailer'
import { ISendEmail } from './../../application/Interfaces'



export default class NodemailerSendEmail implements ISendEmail
{
    private _transporter : any

    constructor(user : string, password : string)
    {
        this._transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: user,
                pass: password
            }
        })
    }

    async execute(to : string, from : string, subject : string, text : string, html? : string)
    {
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        }

        return new Promise((resolve, reject)=> {
            this._transporter.sendMail(mailOptions, (error : Error, info : any)=> {
                if(error)
                {
                    reject(error)
                } else {
                    resolve(info)
                }
            })
        })
    }
}
