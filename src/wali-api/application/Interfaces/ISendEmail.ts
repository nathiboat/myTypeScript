interface ISendEmail
{
    execute(to : string, from : string, subject : string, text : string, html? : string) : Promise<any>
}

export default ISendEmail
