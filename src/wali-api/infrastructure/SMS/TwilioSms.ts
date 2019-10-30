import { ISendSMS } from './../../application/Interfaces'


export default class TwilioSms implements ISendSMS
{

    private client: any;
    private fromNumber: string;

    constructor(accountSid: string, authToken: string, fromNumber: string){
      this.fromNumber = fromNumber;
      this.client = require('twilio')(accountSid, authToken);
    }

    async execute(toNumber: string, toMessage: string){

      let params: any={
        body: toMessage,
        from: this.fromNumber, //Set in .env
        to: toNumber
      }

      return await this.client.messages.create(params)
    }
}
