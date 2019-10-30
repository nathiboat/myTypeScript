import {
    Member,
    Answer
} from './../../../../domain'
import { ILocale } from './../../../../application'
import IBuildRejectBody from './IBuildRejectBody'



export default class BuildRejectEmailBody implements IBuildRejectBody
{
    private _locale : ILocale


    constructor(locale : ILocale)
    {
        this._locale = locale
    }

    async execute(member : Member, answer : Answer)
    {
        let emailBody : string[] = []

        // Get the member language
        let memberLang = this._locale.isValidOrDefault(member.locale)

        emailBody.push(
            await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                member.activeProfile === 1 ? 'WALI_REJECTED_PROFILE_NEEDS_WORK' : 'WALI_REJECTED_PROFILE_INACTIVE_NEEDS_WORK'
            )
        )

        // This needs to be abstracted in a Facade
        // If photo verification is rejected
        if(!answer.validVerificationPhoto())
        {
            emailBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTOVERIFICATION') }`)
        }

        // If photo 1 is rejected
        if(!answer.validFirstPhoto())
        {
            if(member.gender === 'M')
            {
                emailBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTO1_M') }`)
            } else {
                emailBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTO1_F') }`)
            }
        }

        // If one or more images from photo2 ... photo5 is rejected
        if(answer.invalidImagesExcludingFirst().length < 2)
        {
            emailBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTON_1') }`)
        } else {
            emailBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTON_N') }`)
        }

        // If long description is rejected
        if(!answer.validDescription())
        {
            emailBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_LONGDESCRIPTION') }`)
        }

        emailBody.push(
            await this._locale.key(
                memberLang,
                'EMAIL_SEE_YOU_BACK_SOON'
            )
        )

        return emailBody.join('\n\n')
    }

}