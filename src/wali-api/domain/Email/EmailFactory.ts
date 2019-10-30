import Email from './Email'

type EmailOptions = {
    toEmail : string,
    from : string,
    subject : string,
    body : string
}

export default class EmailFactory 
{
    static build(options : EmailOptions) 
    {
        return new Email(
            options.toEmail,
            options.from,
            options.subject,
            options.body
        )
    }
}