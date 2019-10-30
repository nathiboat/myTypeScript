import { Container } from 'typescript-dependency-injection'
import {
    GeneratePasswordService,

    LoginStaffService,
    LoginStaffResponse,

    RegisterStaffService,
    RegisterStaffResponse,

    UpdateStaffService,
    UpdateStaffResponse,

    CreateRoleService,
    CreateRoleResponse,

    GetRolesService,
    GetRolesResponse,

    AuthenticateStaffService,
    RemoveRoleService,

    GenerateQuestionsForMembers,
    GenerateQuestionsResponse,

    FlagMemberService,
    // PermanentlyBlockedService,
    // UnblockService,
    GetPendingApprovalNumberService,
    ApproveMemberService,

    GetStaffCollectionService,
    GetStaffCollectionResponse,

    RemoveStaffService,

    GetLoggedInStaffService,
    GetLoggedInStaffResponse,

    RewardMemberService,
    RewardService,
    RewardWithReferrerMember,
    RewardFromInviteCode,
    RewardDefault,
    BuildRejectMessageBody,
    BuildRejectEmailBody,
    BuildRewardFromInviteCode,

    AuthenticateTaskManager } from './../wali-api/application'
import { HashPasswordService, CheckPasswordHashService } from "../wali-api/infrastructure/Authenticate"


let container = new Container()


// Setup the env
let isDev = process.env.IS_DEV === undefined || process.env.IS_DEV === 'false' ? false : true

// If dev mode is ON then pass in MailTrap as Email Sender Service,
// if false then pass in the true Email Sender

if(!process.env.SALT_ROUNDS) { throw Error('Env values not set for SALT_ROUNDS')}

container.register(HashPasswordService)
        .dependsOnNumber(parseInt(process.env.SALT_ROUNDS))


container.register(CheckPasswordHashService)

let generatePasswordService = container.register(GeneratePasswordService)
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('HashPasswordService')
        .dependsOnClass('StaffDB.Commands.UpdateStaffCommand')
        .dependsOnClass('AwsSesSendEmail')
        .dependsOnClass('GenerateRandomPasswordService')
        .dependsOnClass('StaffSessionDB.Commands.InsertStaffSessionCommand')
        .dependsOnClass('GenerateTokenService')
        .dependsOnClass('StaffSessionDB.Queries.SelectStaffSessionQuery')
        .dependsOnClass('StaffSessionDB.Commands.UpdateStaffSessionCommand')


//If IS_DEV is true then we want to use mailtrap to capture password and email
if(process.env.IS_DEV && process.env.MASTER_EMAIL && process.env.MASTER_PASSWORD)
{
    generatePasswordService.dependsOnString(process.env.MASTER_EMAIL!)
                        .dependsOn(process.env.MASTER_PASSWORD!)
}


container.register(LoginStaffService)
        .dependsOnClass('StaffDB.Queries.SelectAllStaffQuery')
        .dependsOnClass('CheckPasswordHashService')
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('StaffDB.Commands.UpdateStaffCommand')
        .dependsOnClass('StaffLogDB.Commands.InsertStaffLogCommand')
        .dependsOnClass('StaffSessionDB.Queries.SelectStaffSessionQuery')
        .dependsOnClass('StaffSessionDB.Commands.UpdateStaffSessionCommand')
        .dependsOn(()=> new LoginStaffResponse())

container.register(RegisterStaffService)
        .dependsOnClass('StaffDB.Commands.InsertStaffCommand')
        .dependsOnClass('RoleDB.Queries.SelectRoleIncludeIdsQuery')
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('AwsSesSendEmail')
        .dependsOn(()=> new RegisterStaffResponse())

container.register(UpdateStaffService)
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('StaffDB.Commands.UpdateStaffCommand')
        .dependsOnClass('RoleDB.Queries.SelectRoleIncludeIdsQuery')
        .dependsOnClass('AwsSesSendEmail')
        .dependsOn(()=> new UpdateStaffResponse())

container.register(RemoveStaffService)
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('StaffDB.Commands.DeleteStaffCommand')

container.register(CreateRoleService)
        .dependsOnClass('InsertRoleCommand')
        .dependsOnClass('SelectRoleByNameAndProductQuery')
        .dependsOn(()=> new CreateRoleResponse())

container.register(GetRolesService)
        .dependsOnClass('RoleDB.Queries.SelectAllRolesQuery')
        .dependsOn(()=> new GetRolesResponse())

container.register(RemoveRoleService)
        .dependsOnClass('RoleDB.Commands.DeleteRoleCommand')

container.register(AuthenticateStaffService)
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('CheckTokenService')
        .dependsOnClass('StaffSessionDB.Queries.SelectStaffSessionQuery')

container.register(GetLoggedInStaffService)
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('CheckTokenService')
        .dependsOnClass('StaffSessionDB.Queries.SelectStaffSessionQuery')
        .dependsOn(()=> new GetLoggedInStaffResponse())

container.register(GenerateQuestionsForMembers)
        .dependsOnClass('SelectApprovalPendingMemberIdsQuery')
        .dependsOnClass('SelectMemberByIdQuery')
        .dependsOnClass('QuestionCollection')
        .dependsOnClass('WaliApproveLock')
        .dependsOnClass('WaliApproveList')
        .dependsOnClass('StaffLogDB.Commands.InsertStaffLogCommand')
        .dependsOn(()=> new GenerateQuestionsResponse())

container.register(FlagMemberService)
        .dependsOnClass('MemberDB.Queries.SelectMemberByHashIdQuery')
        .dependsOnClass('MemberDB.Queries.SelectMemberApprovalByIdQuery')
        .dependsOnClass('MemberDB.Commands.UpdateMemberApprovalCommand')
        .dependsOnClass('MemberDB.Commands.InsertMemberApprovalCommand')
        .dependsOnClass('WaliApproveList')

container.register(ApproveMemberService)
         .dependsOnClass('MemberDB.Commands.UpdateMemberApprovalCommand')
         .dependsOnClass('MemberDB.Queries.SelectMemberByHashIdQuery')
         .dependsOnClass('WaliApproveList')
         .dependsOnClass('MemberDB.Commands.UpdateMemberCommand')
         .dependsOnClass('MemberDB.Queries.SelectMemberApprovalByIdQuery')
         .dependsOnClass('MemberLogDB.Commands.InsertMemberLogCommand')
         .dependsOnClass('StaffLogDB.Commands.InsertStaffLogCommand')
         .dependsOnClass('XmppNotification')
         .dependsOnClass('SNSPushNotification')
         .dependsOnClass('RewardService')
         .dependsOnClass('MessageDB.Commands.InsertMessageCommand')
         .dependsOnClass('MatchDB.Commands.UpdateLastMessageBodyCommand')
         .dependsOnClass('AwsSesSendEmail')
         .dependsOnClass('RedisCache')

container.register(GetPendingApprovalNumberService)
         .dependsOnClass('SelectApprovalPendingMemberIdsQuery')
         .dependsOnClass('WaliApproveList')

container.register(GetStaffCollectionService)
         .dependsOnClass('StaffDB.Queries.SelectAllStaffQuery')
         .dependsOn(()=> new GetStaffCollectionResponse())

// TODO: Remove this RewardMemberService and replace with RewardService
container.register(RewardMemberService)
         .dependsOnClass('MemberDB.Queries.SelectMemberByIdQuery')
         .dependsOnClass('MemberDB.Commands.UpdateMemberCommand')
         .dependsOnClass('InviteCodeDB.Queries.SelectInviteCodesQuery')
         .dependsOnClass('MatchDB.Queries.SelectMatchIdQuery')
         .dependsOnClass('MemberDB.Commands.UpdateMemberRewardTransaction')
         .dependsOnClass('Locale')

// Register RewardService
container.register(RewardService)
         .dependsOnClass('RewardWithReferrerMember')
         .dependsOnClass('RewardFromInviteCode')
         .dependsOnClass('RewardDefault')
         .dependsOnClass('BuildRejectMessageBody')
         .dependsOnClass('BuildRejectEmailBody')
         .dependsOnClass('MemberDB.Commands.UpdateMemberCommand')
         .dependsOnClass('MatchDB.Queries.SelectMatchIdQuery')
         .dependsOnClass('Locale')

container.register(RewardWithReferrerMember)
         .dependsOnClass('MemberDB.Commands.UpdateMemberCommand')
         .dependsOnClass('MemberDB.Queries.SelectMemberByIdQuery')
         .dependsOnClass('MatchDB.Queries.SelectMatchIdQuery')
         .dependsOnClass('InviteCodeDB.Queries.SelectInviteCodesQuery')
         .dependsOnClass('Locale')
         .dependsOnClass('BuildRewardFromInviteCode')

container.register(RewardFromInviteCode)
         .dependsOnClass('InviteCodeDB.Queries.SelectInviteCodesQuery')
         .dependsOnClass('BuildRewardFromInviteCode')
         .dependsOnClass('MatchDB.Queries.SelectMatchIdQuery')
         .dependsOnClass('Locale')

container.register(RewardDefault)
         .dependsOnClass('MemberDB.Commands.UpdateMemberCommand')
         .dependsOnClass('MatchDB.Queries.SelectMatchIdQuery')
         .dependsOnClass('Locale')

container.register(BuildRejectMessageBody)
         .dependsOnClass('Locale')

container.register(BuildRejectEmailBody)
         .dependsOnClass('Locale')

container.register(BuildRewardFromInviteCode)
         .dependsOnClass('MemberDB.Commands.UpdateMemberRewardTransaction')
         .dependsOnClass('Locale')

container.register(AuthenticateTaskManager)
        .dependsOnClass('StaffDB.Queries.SelectOneStaffByQuery')
        .dependsOnClass('CheckTokenService')
        .dependsOnClass('StaffSessionDB.Queries.SelectStaffSessionQuery')

export default container
