
import { Member } from './../../../../Domain'

type DatabaseRow = { [key: string]: any }


export default abstract class MemberTransformer 
{
    static toModel(rows: DatabaseRow[]) 
    {
        return rows.map((row) => {
            return Member.build({
                memberId: row.memberID,
                approvedCount: row.approvedCount,
                approvalState: row.approvalState,
                waliEmailAddressConfirmed: row.waliEmailAddressConfirmed,
                emailAddressConfirmed: row.emailAddressConfirmed,
                phoneNumberConfirmed: row.phoneNumberConfirmed,
                photosApproved: row.photosApproved,
                pushNotifications: row.pushNotifications,
                nickname: row.nickname,
                gender: row.gender,
                emailAddress: row.emailAddress,
                phoneNumber: row.phoneNumber,
                fbId: row.fbId,
                udid: row.udid,
                passwordToken: row.passwordToken,
                profileCreated: row.profileCreated,
                deviceOs: row.deviceOs,
                approved: row.approved,
                activeProfile: row.activeProfile,
                devicePushToken: row.devicePushToken,
                awsendpointArn: row.awsendpointArn,
                premium: row.premium,
                premiumStarted: row.premiumStarted,
                premiumExpires: row.premiumExpires,
                premiumProductSuffix: row.premiumProductSuffix,
                hashMemberId: row.hashMemberID,
                lastActiveTimeStamp: row.lastActiveTimeStamp,
                timeStampRegistered: row.timeStampRegistered,
                timeStampCreatedProfile: row.timeStampCreatedProfile,
                timeStampCompletedProfile: row.timeStampCompletedProfile,
                consentedAtTimeStamp: row.consentedAtTimeStamp,
                idfa: row.idfa,
                oldPhoneNumber: row.oldPhoneNumber,
                oldEmailAddress: row.oldEmailAddress,
                sect: row.sect,
                maritalStatus: row.maritalStatus,
                profession: row.profession,
                ethnicOrigin: row.ethnicOrigin,
                photoOne: row.photo1,
                photoTwo: row.photo2,
                photoThree: row.photo3,
                photoFour: row.photo4,
                photoFive: row.photo5,
                photoVerification: row.photoVerification,
                photoOneBlurred: row.photo1Blurred,
                photoTwoBlurred: row.photo2Blurred,
                photoThreeBlurred: row.photo3Blurred,
                photoFourBlurred: row.photo4Blurred,
                photoFiveBlurred: row.photo5Blurred,
                publicPhotos: row.publicPhotos,
                timeStamp: row.timeStamp,
                prayerLevel: row.prayerLevel,
                practisingLevel: row.practisingLevel,
                waliEmailAddress: row.waliEmailAddress,
                country: row.country,
                admin: row.admin,
                dobDay: row.dobDay,
                dobMonth: row.dobMonth,
                dobYear: row.dobYear,
                height: row.height,
                islamicDress: row.islamicDress,
                discoverable: row.discoverable,
                permanentlyBlocked: row.permanentlyBlocked,
                banExpires: row.banExpires,
                appVersion: row.appVersion,
                deletedAccountReason: row.deletedAccountReason,
                deviceModel: row.deviceModel,
                deviceVersion: row.deviceVersion,
                gpslongitude: row.gpslongitude,
                gpslatitude: row.gpslatitude,
                gpsderivedLocation: row.gpsderivedLocation,
                gpsderivedCountry: row.gpsderivedCountry,
                gpsderivedTimezone: row.gpsderivedTimezone,
                serverRemoteAddr: row.serverRemoteAddr,
                httpXForwardedFor: row.httpXForwardedFor,
                ipAddressCountryCode: row.ipAddressCountryCode,
                iplatitude: row.iplatitude,
                iplongitude: row.iplongitude,
                ipderivedLocation: row.ipderivedLocation,
                ipderivedCountry: row.ipderivedCountry,
                ipderivedTimezone: row.ipderivedTimezone,
                languages: row.languages,
                locale: row.locale,
                httpAcceptLanguage: row.httpAcceptLanguage,
                countryFromSim: row.countryFromSim,
                countryFromDeviceLocale: row.countryFromDeviceLocale,
                timezoneFromPhone: row.timezoneFromPhone,
                sendAdminBlastPushNotifications: row.sendAdminBlastPushNotifications,
                education: row.education,
                jobTitle: row.jobTitle,
                companyOfEmployment: row.companyOfEmployment,
                onlyEatHalal: row.onlyEatHalal,
                drinkAlcohol: row.drinkAlcohol,
                revert: row.revert,
                smoker: row.smoker,
                marriageHorizon: row.marriageHorizon,
                citizenshipCountry: row.citizenshipCountry,
                ethnicityGrouping: row.ethnicityGrouping,
                willingToRelocateNationally: row.willingToRelocateNationally,
                willingToRelocateAbroad: row.willingToRelocateAbroad,
                statusMessage: row.statusMessage,
                longDescription: row.longDescription,
                profileReviewedByAdmin: row.profileReviewedByAdmin,
                adminProfileReviewComment: row.adminProfileReviewComment,
                children: row.children,
                promptPostRegistration: row.promptPostRegistration,
                emailConfirmationPincode: row.emailConfirmationPincode,
                timeStampNicknameLastUpdated: row.timeStampNicknameLastUpdated,
                timeStampDoblastUpdated: row.timeStampDoblastUpdated,
                timeStampGenderLastUpdated: row.timeStampGenderLastUpdated,
                jailbrokenDevice: row.jailbrokenDevice,
                emailNotifications: row.emailNotifications,
                emailReengagement: row.emailReengagement,
                emailMarketing: row.emailMarketing,
                fbEmailAddress: row.fbEmailAddress,
                instantMatchCredit: row.instantMatchCredit,
                referrerInviteCode: row.referrerInviteCode,
                referrerMemberId: row.referrerMemberId,
                badgeCount: row.badgeCount,
                hideAds: row.hideAds,
                hidePremiumBadge: row.hidePremiumBadge,
                refSource: row.refSource,
                refMedium: row.refMedium,
                refCampaign: row.refCampaign,
                refTerm: row.refTerm,
                refContent: row.refContent,
                timeStampFirstInstalled: row.timeStampFirstInstalled,
                deleteAfterTimeStamp: row.deleteAfterTimeStamp
            })
        })
    }

    static toRaw(model: Member) 
    {
        return {
            memberId: model.memberId,
            approvedCount: model.approvedCount,
            approvalState: model.approvalState,
            waliEmailAddressConfirmed: model.waliEmailAddressConfirmed,
            emailAddressConfirmed: model.emailAddressConfirmed,
            phoneNumberConfirmed: model.phoneNumberConfirmed,
            photosApproved: model.photosApproved,
            pushNotifications: model.pushNotifications,
            nickname: model.nickname,
            gender: model.gender,
            emailAddress: model.emailAddress,
            phoneNumber: model.phoneNumber,
            fbId: model.fbId,
            udid: model.udid,
            passwordToken: model.passwordToken,
            profileCreated: model.profileCreated,
            deviceOs: model.deviceOs,
            approved: model.approved,
            activeProfile: model.activeProfile,
            devicePushToken: model.devicePushToken,
            awsendpointArn: model.awsendpointArn,
            premium: model.premium,
            premiumStarted: model.premiumStarted,
            premiumExpires: model.premiumExpires,
            premiumProductSuffix: model.premiumProductSuffix,
            hashMemberID: model.hashMemberId,
            lastActiveTimeStamp: model.lastActiveTimeStamp,
            timeStampRegistered: model.timeStampRegistered,
            timeStampCreatedProfile: model.timeStampCreatedProfile,
            timeStampCompletedProfile: model.timeStampCompletedProfile,
            consentedAtTimeStamp: model.consentedAtTimeStamp,
            idfa: model.idfa,
            oldPhoneNumber: model.oldPhoneNumber,
            oldEmailAddress: model.oldEmailAddress,
            sect: model.sect,
            maritalStatus: model.maritalStatus,
            profession: model.profession,
            ethnicOrigin: model.ethnicOrigin,
            photo1: model.photoOne,
            photo2: model.photoTwo,
            photo3: model.photoThree,
            photo4: model.photoFour,
            photo5: model.photoFive,
            photoVerification: model.photoVerification,
            photo1Blurred: model.photoOneBlurred,
            photo2Blurred: model.photoTwoBlurred,
            photo3Blurred: model.photoThreeBlurred,
            photo4Blurred: model.photoFourBlurred,
            photo5Blurred: model.photoFiveBlurred,
            publicPhotos: model.publicPhotos,
            timeStamp: model.timeStamp,
            prayerLevel: model.prayerLevel,
            practisingLevel: model.practisingLevel,
            waliEmailAddress: model.waliEmailAddress,
            country: model.country,
            admin: model.admin,
            dobDay: model.dobDay,
            dobMonth: model.dobMonth,
            dobYear: model.dobYear,
            height: model.height,
            islamicDress: model.islamicDress,
            discoverable: model.discoverable,
            permanentlyBlocked: model.permanentlyBlocked,
            banExpires: model.banExpires,
            appVersion: model.appVersion,
            deletedAccountReason: model.deletedAccountReason,
            deviceModel: model.deviceModel,
            deviceVersion: model.deviceVersion,
            gpslongitude: model.gpslongitude,
            gpslatitude: model.gpslatitude,
            gpsderivedLocation: model.gpsderivedLocation,
            gpsderivedCountry: model.gpsderivedCountry,
            gpsderivedTimezone: model.gpsderivedTimezone,
            serverRemoteAddr: model.serverRemoteAddr,
            httpXForwardedFor: model.httpXForwardedFor,
            ipAddressCountryCode: model.ipAddressCountryCode,
            iplatitude: model.iplatitude,
            iplongitude: model.iplongitude,
            ipderivedLocation: model.ipderivedLocation,
            ipderivedCountry: model.ipderivedCountry,
            ipderivedTimezone: model.ipderivedTimezone,
            languages: model.languages,
            locale: model.locale,
            httpAcceptLanguage: model.httpAcceptLanguage,
            countryFromSim: model.countryFromSim,
            countryFromDeviceLocale: model.countryFromDeviceLocale,
            timezoneFromPhone: model.timezoneFromPhone,
            sendAdminBlastPushNotifications: model.sendAdminBlastPushNotifications,
            education: model.education,
            jobTitle: model.jobTitle,
            companyOfEmployment: model.companyOfEmployment,
            onlyEatHalal: model.onlyEatHalal,
            drinkAlcohol: model.drinkAlcohol,
            revert: model.revert,
            smoker: model.smoker,
            marriageHorizon: model.marriageHorizon,
            citizenshipCountry: model.citizenshipCountry,
            ethnicityGrouping: model.ethnicityGrouping,
            willingToRelocateNationally: model.willingToRelocateNationally,
            willingToRelocateAbroad: model.willingToRelocateAbroad,
            statusMessage: model.statusMessage,
            longDescription: model.longDescription,
            profileReviewedByAdmin: model.profileReviewedByAdmin,
            adminProfileReviewComment: model.adminProfileReviewComment,
            children: model.children,
            promptPostRegistration: model.promptPostRegistration,
            emailConfirmationPincode: model.emailConfirmationPincode,
            timeStampNicknameLastUpdated: model.timeStampNicknameLastUpdated,
            timeStampDoblastUpdated: model.timeStampDoblastUpdated,
            timeStampGenderLastUpdated: model.timeStampGenderLastUpdated,
            jailbrokenDevice: model.jailbrokenDevice,
            emailNotifications: model.emailNotifications,
            emailReengagement: model.emailReengagement,
            emailMarketing: model.emailMarketing,
            fbEmailAddress: model.fbEmailAddress,
            instantMatchCredit: model.instantMatchCredit,
            referrerInviteCode: model.referrerInviteCode,
            referrerMemberId: model.referrerMemberId,
            badgeCount: model.badgeCount,
            hideAds: model.hideAds,
            hidePremiumBadge: model.hidePremiumBadge,
            refSource: model.refSource,
            refMedium: model.refMedium,
            refCampaign: model.refCampaign,
            refTerm: model.refTerm,
            refContent: model.refContent,
            timeStampFirstInstalled: model.timeStampFirstInstalled,
            deleteAfterTimeStamp: model.deleteAfterTimeStamp
        }
    }
}
