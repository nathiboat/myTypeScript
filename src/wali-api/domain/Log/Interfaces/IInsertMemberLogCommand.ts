import MemberLog from './../MemberLog'


export default interface IInsertMemberLogCommand
{
    execute(memberLog : MemberLog) : Promise<null>
}
