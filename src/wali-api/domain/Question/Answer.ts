import Field from './Field'
import { Member, Approval } from './../../domain'



export default class Answer
{

    private _fields : { [key: string] : Field } = {}


    constructor(fields : { answer: string, field: string }[])
    {
        fields.forEach((field)=> {
            this._fields[field.field] = new Field(field.answer, field.field)
        })
    }

    validMinimumRequirements(requirements : string[])
    {
        let result = true
        requirements.forEach((requirement)=> {
            if(!(requirement in this._fields) || !this._fields[requirement].isApproved())
            {
                result = false
            }
        })
        return result
    }

    getMinimumRequirements(member : Member)
    {
        if(![1, 2].includes(member.complete))
        {
            throw Error(`Member completion level must be 1 or 2, current: ${ member.complete }`)
        }
        // If member complete is not 1, then it must be 2
        // If it's any other number then it would fail above
        if(member.complete === 1)
        {
            return ['photoVerification', 'photo1']
        } else {
            return ['photoVerification', 'photo1', 'longDescription']
        }
    }

    validImages()
    {
        return Object.values(this._fields).filter((field)=> {
            return field.field.includes('photo') && field.isApproved()
        }).map(field => field.field)
    }

    invalidImages()
    {
        return Object.values(this._fields).filter((field)=> {
            return field.field.includes('photo') && !field.isApproved()
        }).map(field => field.field)
    }

    invalidImagesExcludingFirst()
    {
        return Object.values(this._fields).filter((field)=> {
            return ['photo2', 'photo3', 'photo4', 'photo5'].includes(field.field) && !field.isApproved()
        }).map(field => field.field)
    }

    validStatus()
    {
        let statusField = this._fields['statusMessage']
        return statusField && statusField.isApproved()
    }

    validDescription()
    {
        let statusField = this._fields['longDescription']
        return statusField && statusField.isApproved()
    }

    validVerificationPhoto()
    {
        let photoVerification = this._fields['photoVerification']
        return photoVerification && photoVerification.isApproved()
    }

    validFirstPhoto()
    {
        let firstPhoto = this._fields['photo1']
        return firstPhoto && firstPhoto.isApproved()
    }

    isValid(member : Member) : boolean
    {
        let requirements = this.getMinimumRequirements(member)
        let validMinimumRequirements = this.validMinimumRequirements(requirements)
        if(!validMinimumRequirements)
        {
            return false
        }

        // let result = Object.values(this._fields).filter((field : Field)=> {
        //     return !field.isApproved()
        // })
        // if(result.length > 0)
        // {
        //     return false
        // }

        return true
    }

    getAllFields()
    {
        return Object.keys(this._fields)
    }

    updateApprovalReport(approval : Approval) : Approval
    {
        if(this._fields['longDescription'])
        {
            approval.setLongDescription(this.validDescription())
        }

        if(this._fields['statusMessage'])
        {
            approval.setStatusMessage(this.validStatus())
        }
       
        if(this._fields['photo1'])
        {
            approval.setPhoto1(this._fields['photo1'].isApproved())
        }

        if(this._fields['photo2'])
        {
            approval.setPhoto2(this._fields['photo2'].isApproved())
        }

        if(this._fields['photo3'])
        {
            approval.setPhoto3(this._fields['photo3'].isApproved())
        }

        if(this._fields['photo4'])
        {
            approval.setPhoto4(this._fields['photo4'].isApproved())
        }

        if(this._fields['photo5'])
        {
            approval.setPhoto5(this._fields['photo5'].isApproved())
        }

        if(this._fields['photoVerification'])
        {
            approval.setPhotoVerification(this._fields['photoVerification'].isApproved())
        }

        return approval
    }
}
