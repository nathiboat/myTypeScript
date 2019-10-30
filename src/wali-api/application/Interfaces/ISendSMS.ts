interface ISendSMS
{
    execute(toNumber: string, toMessage: string):Promise<any>;
}

export default ISendSMS
