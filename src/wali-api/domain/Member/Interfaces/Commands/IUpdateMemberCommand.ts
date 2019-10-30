import { Member } from './../../../../domain'


export default interface IUpdateMemberCommand
{
    execute(member : Member) : Promise<null>
}
