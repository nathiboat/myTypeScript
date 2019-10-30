
export default interface IUpdateLastMessageBody
{
    execute(lastMessageBody : string, lastSenderId : number, matchId : number) : Promise<null>
}