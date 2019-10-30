interface ISendXmpp
{
    execute(to : string, from : string, subject : string, text : string ):Promise<any>;
}

export default ISendXmpp