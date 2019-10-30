import QueueMember from './QueueMemberType'


interface IWaliApproveLock
{
    push(params : QueueMember) : void

    get() : Promise<QueueMember[]>

    addExpireIn(minute? : number) : string

    removeMember(memberId : number) : Promise<void>
}

export default IWaliApproveLock
