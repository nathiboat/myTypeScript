import Image from './Image'
import Complete from './Complete'
import Gender from './Gender'
import moment from 'moment'

export default class Member
{
    private _nickname : string

    private _description : string

    private _dobDay : number

    private _dobMonth : number

    private _dobYear : number

    private _images : Image[] = []

    private _complete : Complete

    private _approvalState : number

    private _instantMatchCredit : number

    private _premium : number

    private _gender : Gender

    private _deviceOS : string

    private _AWSendpointARN : string

    private _status? : string

    private _timeStamp : Date

    public _id? : number

    private _idfa? : string

    private _udid? : string

    private _online? : boolean

    private _permanentlyBlocked? : boolean

    private _passwordToken? : string | null

    private _approved? : number

    private _profileReviewedByAdmin? : number

    private _hashId? : string
  
    private _locale? : string
  
    private _deleteAfterTimeStamp? : Date
  
    private _activeProfile? : number
  
    private _emailAddress? : string
  
    private _referrerMemberId? : number

    private _referrerInviteCode? : string


    constructor(
        nickname : string,
        description : string,
        dobDay : number,
        dobMonth : number,
        dobYear : number,
        complete : number,
        approvalState : number,
        instantMatchCredit : number,
        premium : number,
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
        emailAddress? : string,
        referrerMemberId? : number,
        referrerInviteCode? : string,
        id? : number,

    ){
        this._nickname           = nickname
        this._status             = status
        this._description        = description
        this._complete           = new Complete(complete)
        this._instantMatchCredit = instantMatchCredit
        this._premium            = premium
        this._gender             = new Gender(gender)
        this._deviceOS           = deviceOS
        this._AWSendpointARN     = AWSendpointARN
        this._timeStamp          = timeStamp ? new Date(timeStamp) : new Date()
        this._id                 = id
        this._permanentlyBlocked = permanentlyBlocked
        this._idfa               = idfa
        this._udid               = udid
        this._online             = online
        this._passwordToken      = passwordToken
        this._approved           = approved
        this._approvalState      = approvalState
        this._hashId             = hashId
        this._locale             = locale
        this._deleteAfterTimeStamp   = deleteAfterTimeStamp
        this._profileReviewedByAdmin = profileReviewedByAdmin
        this._activeProfile          = activeProfile
        this._emailAddress           = emailAddress
        this._referrerMemberId       = referrerMemberId
        this._referrerInviteCode     = referrerInviteCode
        this._dobDay                 = dobDay 
        this._dobMonth               = dobMonth
        this._dobYear                = dobYear 
    }

    addImage(name : string, type : string, isVerification? : boolean)
    {
        this._images.push(new Image(name, type, isVerification))
    }

    get id()
    {
        return this._id
    }

    get gender()
    {
        return this._gender.value
    }

    get images()
    {
        return this._images
    }

    get verificationImage()
    {
        return this._images.filter((image)=> {
            return image.isVerification === true
        })
    }

    get memberImages()
    {
        return this._images.filter((image)=> {
            return image.isVerification === false
        })
    }

    get photo1() {
        return this._images.filter((image) => {
            return image.type === 'photo1'
        })[0]
    }

    get nickname()
    {
        return this._nickname
    }

    get status()
    {
        return this._status
    }

    get description()
    {
        return this._description
    }

    get complete()
    {
        return this._complete.level
    }

    get profileReviewedByAdmin() {
        return this._profileReviewedByAdmin
    }

    get instantMatchCredit()
    {
        return this._instantMatchCredit
    }

    get deviceOS()
    {
        return this._deviceOS
    }

    get AWSendpointARN()
    {
        return this._AWSendpointARN
    }

    get premium()
    {
        return this._premium
    }

    get timeStamp()
    {
        return this._timeStamp
    }

    get permanentlyBlocked()
    {
        return this._permanentlyBlocked
    }

    get idfa()
    {
        return this._idfa
    }

    get udid()
    {
        return this._udid
    }

    get online()
    {
        return this._online
    }
    get passwordToken()
    {
        return this._passwordToken
    }

    get approved() {
        return this._approved
    }

    get approvalState()
    {
        return this._approvalState
    }

    get hashId()
    {
        return this._hashId
    }

    get referrerMemberId() {
        return this._referrerMemberId
    }

    get locale() {
        return this._locale
    }

    get deleteAfterTimeStamp() {
        return this._deleteAfterTimeStamp
    }

    get activeProfile() {
        return this._activeProfile
    }

    get emailAddress() {
        return this._emailAddress
    }

    get referrerInviteCode()
    {
        return this._referrerInviteCode
    }

    get age() {
        return moment().diff(moment(this._dobYear + '' + this._dobMonth + '' + this._dobDay, 'YYYYMMDD'), 'years')
    }

    set instantMatchCredit(value : number)
    {
        this._instantMatchCredit = value
    }

    set approvalState(value : number)
    {
        this._approvalState = value
    }

    setReferrerInviteCode(value? : string)
    {
        this._referrerInviteCode = value
    }

    setReferrerMemberId(value? : number)
    {
        this._referrerMemberId = value
    }

    setPermanentlyBlocked(isBlocked: boolean)
    {
        this._permanentlyBlocked = isBlocked
    }

    setOnline(isOnline: boolean)
    {
        this._online = isOnline
    }

    setPasswordToken(token: string | null)
    {
        this._passwordToken = token
    }

    setApproved(value: number) {
        this._approved = value
    }

    setProfileReviewedByAdmin(value: number) {
        this._profileReviewedByAdmin = value
    }

    setStatus(value? : string)
    {
        this._status = value
    }

    removeImage(type: string)
    {
        this._images = this._images.filter(image => {
            return image.type !== type
        })
    }

    removeImages(imageTypes : string[])
    {
        imageTypes.map((type)=> {
            this.removeImage(type)
        })
    }

    isValidReferrer(referrerMember : Member) : boolean
    {
        if(!this.referrerMemberId)
        {
            return false
        }

        if(referrerMember.udid === this.udid || !referrerMember.udid || !this.udid)
        {
            return false
        }

        if(referrerMember.idfa === this.idfa || !referrerMember.idfa || !this.idfa)
        {
            return false
        }

        return true
    }

}
