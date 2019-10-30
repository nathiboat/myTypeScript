import {
    Member,
    InviteCode } from './../../../../domain'

export default interface IBuildRewardFromInviteCode
{
    execute(member : Member, inviteCode : InviteCode) : Promise<string | null>
}