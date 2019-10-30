import {
    Member,
    Answer
} from './../../../../domain'
import { ILocale } from './../../../../application'
import IBuildRejectBody from './IBuildRejectBody'


export default class BuildRejectMessageBody implements IBuildRejectBody
{
    private _locale : ILocale


    constructor(locale : ILocale)
    {
        this._locale = locale
    }

    async execute(member : Member, answer : Answer)
    {
        let messageBody : string[] = []

        // Get the member language
        let memberLang = this._locale.isValidOrDefault(member.locale)

        messageBody.push(
            await this._locale.key(
                this._locale.isValidOrDefault(member.locale),
                'WALI_REJECTED_PROFILE_NEEDS_WORK'
            )
        )

        // This needs to be abstracted
        // If photo verification is rejected
        if(!answer.validVerificationPhoto())
        {
            messageBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTOVERIFICATION') }`)
        }

        // If photo 1 is rejected
        if(!answer.validFirstPhoto())
        {
            if(member.gender === 'M')
            {
                messageBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTO1_M') }`)
            } else {
                messageBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTO1_F') }`)
            }
        }

        // Check if except photo1 is there any other rejected photos
        if(answer.invalidImagesExcludingFirst().length > 0)
        {
            // Find out how many photos were rejected, if 1 or more then 1
            if(answer.invalidImagesExcludingFirst().length === 1)
            {
                messageBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTON_1') }`)
            } else {
                messageBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_PHOTON_N') }`)
            }
        }

        // If long description is rejected
        if(!answer.validDescription())
        {
            messageBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_LONGDESCRIPTION') }`)
        }

        // If status message is rejected
        if(!answer.validStatus())
        {
            messageBody.push(`• ${ await this._locale.key(memberLang, 'WALI_REJECT_STATUSMESSAGE') }`)
        }

        // Insert the reasons why message was declined
        return messageBody.join('\n')
    }
}