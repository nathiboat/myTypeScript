import Member from './Member'


type MemberOptions = {
    nickname : string,
    description : string,
    dobDay : number,
    dobMonth : number,
    dobYear : number
    complete : number,
    approvalState : number,
    instantMatchCredit : number,
    premium : number,
    images : string[],
    verificationImage? : string,
    gender : string,
    deviceOS : string,
    AWSendpointARN : string,
    status? : string,
    timeStamp? : string,
    permanentlyBlocked? : boolean,
    idfa? : string,
    udid? : string,
    online? : boolean,
    passwordToken? : string | null,
    approved? : number,
    hashId? : string,
    locale? : string,
    deleteAfterTimeStamp? : Date,
    profileReviewedByAdmin? : number,
    activeProfile? : number,
    emailAddress? : string
    referrerMemberID? : number,
    referrerInviteCode? : string,
    id? : number,
}

export default abstract class MemberFactory
{
    static build(options : MemberOptions)
    {  
        let member = new Member(
            options.nickname,
            options.description,
            options.dobDay,
            options.dobMonth,
            options.dobYear,
            options.complete,
            options.approvalState,
            options.instantMatchCredit,
            options.premium,
            options.gender,
            options.deviceOS,
            options.AWSendpointARN,
            options.status,
            options.timeStamp,
            options.permanentlyBlocked,
            options.idfa,
            options.udid,
            options.online,
            options.passwordToken,
            options.approved,
            options.hashId,
            options.locale,
            options.deleteAfterTimeStamp,
            options.profileReviewedByAdmin,
            options.activeProfile,
            options.emailAddress,
            options.referrerMemberID,
            options.referrerInviteCode,
            options.id
        )

        // Add the member images to the member
        options.images.map((image, index)=> {
            member.addImage(image, 'photo' + (index+1), false)
        })

        // Add the verification image to the member
        if(options.verificationImage)
        {
            member.addImage(options.verificationImage, 'photoVerification', true)
        }

        return member
    }
}
