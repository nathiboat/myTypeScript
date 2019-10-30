import { MemberFactory, Member } from './../../../../../domain'


export default class MemberResult
{
    private rows : { [key : string] : any }[]

    constructor(rows : { [key : string] : any }[])
    {
        this.rows = rows
    }


    retrieve()
    {
        return this.rows.map((row)=> {

            let images = [row.photo1, row.photo2, row.photo3, row.photo4, row.photo5].filter(image => image !== null)

            let member = MemberFactory.build({
                id: row.memberID,
                nickname: row.nickname,
                status: row.statusMessage,
                description: row.longDescription,
                images: images,
                verificationImage: row.photoVerification,
                complete: row.profileCreated,
                instantMatchCredit: row.instantMatchCredit,
                premium: row.premium,
                gender: row.gender,
                deviceOS: row.deviceOS,
                AWSendpointARN: row.AWSendpointARN,
                timeStamp: row.timeStamp,
                permanentlyBlocked: row.permanentlyBlocked,
                idfa: row.IDFA,
                udid: row.UDID,
                passwordToken: row.passwordToken,
                locale: row.locale,
                deleteAfterTimeStamp: row.deleteAfterTimeStamp,
                profileReviewedByAdmin: row.profileReviewedByAdmin,
                activeProfile: row.activeProfile,
                emailAddress: row.emailAddress,
                approved: row.approved,
                approvalState: row.approvalState,
                hashId: row.hashMemberID,
                referrerMemberID: row.referrerMemberID,
                referrerInviteCode: row.referrerInviteCode,
                dobDay: row.dobDAY,
                dobMonth: row.dobMONTH,
                dobYear: row.dobYEAR
            })

            return member
        })
    }
}
