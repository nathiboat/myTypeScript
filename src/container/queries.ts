import { Container } from 'typescript-dependency-injection'
import { StaffDB, RoleDB, MemberDB, MatchDB, InviteCodeDB, StaffSessionDB } from './../wali-api/infrastructure/Persistence/Mysql'


let container = new Container()

container.register(StaffDB.Queries.SelectOneStaffByQuery)
         .as('StaffDB.Queries.SelectOneStaffByQuery')
         .dependsOnClass('Context')


container.register(RoleDB.Queries.SelectRoleByIdQuery)
         .as('RoleDB.Queries.SelectRoleByIdQuery')
         .dependsOnClass('Context')


container.register(RoleDB.Queries.SelectAllRolesQuery)
         .as('RoleDB.Queries.SelectAllRolesQuery')
         .dependsOnClass('Context')

container.register(RoleDB.Queries.SelectRoleByNameAndProductQuery)
        .dependsOnClass('Context')

container.register(RoleDB.Queries.SelectRoleIncludeIdsQuery)
         .as('RoleDB.Queries.SelectRoleIncludeIdsQuery')
         .dependsOnClass('Context')

container.register(MemberDB.Queries.SelectApprovalPendingMemberIdsQuery)
         .dependsOnClass('Context')

container.register(MemberDB.Queries.SelectMemberByIdQuery)
         .dependsOnClass('Context')

container.register(MemberDB.Queries.SelectMemberApprovalByIdQuery)
         .as('MemberDB.Queries.SelectMemberApprovalByIdQuery')
         .dependsOnClass('Context')

container.register(MemberDB.Queries.SelectMemberByIdfaAndNotBlockedQuery)
         .as('MemberDB.Queries.SelectMemberByIdfaAndNotBlockedQuery')
         .dependsOnClass('Context')

container.register(MemberDB.Queries.SelectCountApprovalPendingMembersQuery)
         .as('MemberDB.Queries.SelectCountApprovalPendingMembersQuery')
         .dependsOnClass('Context')


container.register(MemberDB.Queries.SelectMemberByIdQuery)
         .as('MemberDB.Queries.SelectMemberByIdQuery')
         .dependsOnClass('Context')

container.register(StaffDB.Queries.SelectAllStaffQuery)
         .as('StaffDB.Queries.SelectAllStaffQuery')
         .dependsOnClass('Context')

container.register(MatchDB.Queries.SelectMatchIdQuery)
         .as('MatchDB.Queries.SelectMatchIdQuery')
         .dependsOnClass('Context')

container.register(InviteCodeDB.Queries.SelectInviteCodeQuery)
         .as('InviteCodeDB.Queries.SelectInviteCodesQuery')
         .dependsOnClass('Context')

container.register(MemberDB.Queries.SelectMemberByHashIdQuery)
         .as('MemberDB.Queries.SelectMemberByHashIdQuery')
         .dependsOnClass('Context')

container.register(StaffSessionDB.Queries.SelectStaffSessionQuery)
         .as('StaffSessionDB.Queries.SelectStaffSessionQuery')
         .dependsOnClass('Context')

export default container
