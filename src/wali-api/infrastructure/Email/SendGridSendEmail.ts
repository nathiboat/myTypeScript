import sgMail from '@sendgrid/mail';
import { ISendEmail } from './../../application/Interfaces'


export default class SendGridSendEmail implements ISendEmail
{
    private sgSender : any

    constructor(token : string)
    {
        sgMail.setApiKey(token);
        this.sgSender = sgMail
    }

    async execute(to : string, from : string, subject : string, text : string, html? : string)
    {

        let msg = {
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html,
        }

        return await this.sgSender.send(msg)
    }
}
