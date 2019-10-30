import { Container } from 'typescript-dependency-injection'
import { StaffDB, RoleDB, MemberDB, StaffLogDB, MemberLogDB, MessageDB, SwipeAllocationDB, MatchDB, StaffSessionDB } from './../wali-api/infrastructure/Persistence/Mysql'


let container = new Container()


container.register(StaffDB.Commands.InsertStaffCommand)
         .as('StaffDB.Commands.InsertStaffCommand')
         .dependsOnClass('Context')

container.register(StaffDB.Commands.UpdateStaffCommand)
         .as('StaffDB.Commands.UpdateStaffCommand')
         .dependsOnClass('Context')

container.register(StaffDB.Commands.AttachStaffRoleCommand)
         .as('StaffDB.Commands.AttachStaffRoleCommand')
         .dependsOnClass('Context')

container.register(StaffDB.Commands.DeleteStaffCommand)
          .as('StaffDB.Commands.DeleteStaffCommand')
          .dependsOnClass('Context')

container.register(RoleDB.Commands.InsertRoleCommand)
         .dependsOnClass('Context')

container.register(RoleDB.Commands.DeleteRoleCommand)
         .as('RoleDB.Commands.DeleteRoleCommand')
         .dependsOnClass('Context')

container.register(MemberDB.Commands.UpdateMemberApprovalCommand)
         .as('MemberDB.Commands.UpdateMemberApprovalCommand')
         .dependsOnClass('Context')

container.register(MemberDB.Commands.InsertMemberReportCommand)
         .as('MemberDB.Commands.InsertMemberReportCommand')
         .dependsOnClass('Context')

container.register(MemberDB.Commands.UpdateMemberCommand)
         .as('MemberDB.Commands.UpdateMemberCommand')
         .dependsOnClass('Context')

container.register(MemberDB.Commands.InsertMemberApprovalCommand)
         .as('MemberDB.Commands.InsertMemberApprovalCommand')
         .dependsOnClass('Context')

container.register(StaffLogDB.Commands.InsertStaffLogCommand)
         .as('StaffLogDB.Commands.InsertStaffLogCommand')
         .dependsOnClass('Context')

container.register(MemberLogDB.Commands.InsertMemberLogCommand)
         .as('MemberLogDB.Commands.InsertMemberLogCommand')
         .dependsOnClass('Context')

container.register(MessageDB.Commands.InsertMessageCommand)
         .as('MessageDB.Commands.InsertMessageCommand')
         .dependsOnClass('Context')

container.register(MemberDB.Commands.UpdateMemberInstantMatchCreditCommand)
         .as('MemberDB.Commands.UpdateMemberInstantMatchCreditCommand')
         .dependsOnClass('Context')

container.register(MemberDB.Commands.UpdateMemberPremiumExpiresCommand)
         .as('MemberDB.Commands.UpdateMemberPremiumExpiresCommand')
         .dependsOnClass('Context')

container.register(SwipeAllocationDB.Commands.UpdateSwipeAllocationCommand)
         .as('SwipeAllocationDB.Commands.UpdateSwipeAllocationCommand')
         .dependsOnClass('Context')

container.register(MemberDB.Commands.UpdateMemberRewardTransaction)
         .as('MemberDB.Commands.UpdateMemberRewardTransaction')
         .dependsOnClass('Context')

container.register(MatchDB.Commands.UpdateLastMessageBodyCommand)
         .as('MatchDB.Commands.UpdateLastMessageBodyCommand')
         .dependsOnClass('Context')

container.register(StaffSessionDB.Commands.InsertStaffSessionCommand)
         .as('StaffSessionDB.Commands.InsertStaffSessionCommand')
         .dependsOnClass('Context')

container.register(StaffSessionDB.Commands.UpdateStaffSessionCommand)
         .as('StaffSessionDB.Commands.UpdateStaffSessionCommand')
         .dependsOnClass('Context')

export default container
