import * as AWS from 'aws-sdk';
import { ISendSMS } from './../../application/Interfaces'


export default class AwsSms implements ISendSMS
{
    constructor(apiKeyID: string, apiKeySecret: string, region = "us-east-1"){
        AWS.config.update({
            accessKeyId: apiKeyID,
            secretAccessKey: apiKeySecret,
            region: region
        });
    }
    async execute(toNumber: string, toMessage: string){
        let params = {
            Message: toMessage,
            PhoneNumber: toNumber,
        };

        return await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    }
}
