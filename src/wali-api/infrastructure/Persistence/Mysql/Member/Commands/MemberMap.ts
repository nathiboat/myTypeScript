import { Member, Image } from "../../../../../domain"

export default class MemberMap
{
    static deconstruct(member : Member) : { [key : string] : any }
    {
        let map : any = {
            nickname : member.nickname,
            UDID: member.udid,
            statusMessage : member.status,
            longDescription : member.description,
            profileCreated : member.complete,
            instantMatchCredit: member.instantMatchCredit,
            premium: member.premium,
            gender: member.gender,
            deviceOS: member.deviceOS,
            AWSendpointARN: member.AWSendpointARN,
            timeStamp: member.timeStamp,
            photoVerification: member.verificationImage ? 1: 0,
            permanentlyBlocked : member.permanentlyBlocked ? 1 : 0,
            IDFA : member.idfa,
            activeProfile: member.activeProfile ? 1 : 0,
            passwordToken: member.passwordToken,
            approved: member.approved,
            approvalState: member.approvalState,
            referrerMemberID: member.referrerMemberId,
            referrerInviteCode: member.referrerInviteCode,
            locale: member.locale,
            deleteAfterTimeStamp: member.deleteAfterTimeStamp,
            profileReviewedByAdmin: member.profileReviewedByAdmin,
            emailAddress: member.emailAddress,
            hashMemberID: member.hashId
        }

        // this is used to delete rejected images
        if(member.images)
        {
            let allImages = [
                'photo1',
                'photo2',
                'photo3',
                'photo4',
                'photo5'
            ]

            allImages.forEach((imageType : string) => {
                map[imageType] = null
            })

            member.images.map((image : Image)=> {
                 map[image.type] = image.name
            })
        }
        
        return map
    }
}
