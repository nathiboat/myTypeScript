
export default interface IUpdateMemberPremiumExpireCommand
{
    execute(id : number, numberOfDays : number) : Promise<null>
}