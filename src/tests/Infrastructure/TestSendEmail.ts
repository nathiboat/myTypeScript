import { ISendEmail } from './../../wali-api/application'


export default class TestSendEmail implements ISendEmail
{
    constructor(accessKey : string, sesSecret : string, region : string)
    {
        //
    }

    setConfiguration(configuration : string)
    {
        //
    }

    async execute(to : string, from : string, subject : string, text : string, html? : string)
    {
        return null
    }
}