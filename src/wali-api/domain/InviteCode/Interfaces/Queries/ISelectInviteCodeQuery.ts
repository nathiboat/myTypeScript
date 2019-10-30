
import InviteCode from '../../InviteCode'
export default interface ISelectInviteCodeQuery
{
    execute(inviteCode : string) : Promise<InviteCode[]>
}