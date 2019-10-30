import AWS from 'aws-sdk'
import { ISendEmail } from './../../application/Interfaces'


export default class AwsSesSendEmail implements ISendEmail
{
    private _client : AWS.SES

    private _configuration? : string


    constructor(accessKey : string, sesSecret : string, region : string)
    {
        this._client = new AWS.SES({ accessKeyId: accessKey, secretAccessKey: sesSecret, region: region })
    }

    setConfiguration(configuration : string)
    {
        this._configuration = configuration
    }

    async execute(to : string, from : string, subject : string, text : string, html? : string)
    {
        let charset = 'UTF-8'
        let params : AWS.SES.SendEmailRequest = { 
            Source: from,
            Destination: { 
                ToAddresses: [
                    to 
                ],
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: charset
                },
                Body: {
                    Text: {
                        Data: text,
                        Charset: charset 
                    }
                }
            }
        }

        if(html)
        {
            params['Message']['Body']['Html'] = {
                Data: html,
                Charset: charset 
            }
        }
        
        if(this._configuration)
        {
            params['ConfigurationSetName'] = this._configuration
        }
        
        return new Promise((resolve, reject)=> {
            this._client.sendEmail(params, (error : Error, data : any)=> {
                if(error) 
                {
                    reject(error)
                } else {
                    resolve(data.MessageId)
                }
            }) 
        })
    }
}