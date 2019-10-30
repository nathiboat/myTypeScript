
export default class Approval
{
    private _memberId: number
    private _photo1: boolean
    private _photo2: boolean
    private _photo3: boolean
    private _photo4: boolean
    private _photo5: boolean
    private _photoVerification: boolean
    private _statusMessage: boolean
    private _longDescription: boolean
    private _staffFlagged: boolean
    private _attempts: number
    private _lastUpdated?: Date
    private _actioned : boolean

    constructor(
        memberId: number,
        photo1 : boolean,
        photo2 : boolean,
        photo3 : boolean,
        photo4 : boolean,
        photo5 : boolean,
        photoVerification : boolean,
        statusMessage : boolean,
        longDescription : boolean,
        staffFlagged : boolean,
        attempts : number,
        lastUpdated? : string,
        actioned? : boolean)
    {
        this._memberId = memberId
        this._photo1 = photo1
        this._photo2 = photo2
        this._photo3 = photo3
        this._photo4 = photo4
        this._photo5 = photo5
        this._photoVerification = photoVerification
        this._statusMessage = statusMessage
        this._longDescription = longDescription
        this._staffFlagged = staffFlagged
        this._attempts = attempts
        this._lastUpdated = lastUpdated ? new Date(lastUpdated) : new Date()
        this._actioned = actioned || false
    }

    get memberId() {
        return this._memberId
    }

    get photo1(){
        return this._photo1
    }

    get photo2(){
        return this._photo2
    }

    get photo3(){
        return this._photo3
    }

    get photo4(){
        return this._photo4
    }

    get photo5(){
        return this._photo5
    }

    get photoVerification(){
        return this._photoVerification
    }

    get statusMessage() {
        return this._statusMessage
    }
    get longDescription() {
        return this._longDescription
    }

    get staffFlagged() {
        return this._staffFlagged
    }

    get attempts() {
        return this._attempts
    }

    get lastUpdated() {
        return this._lastUpdated
    }

    get actioned()
    {
        return this._actioned
    }

    setPhoto1(isApprove: boolean) {
        this._photo1 = isApprove
    }

    setPhoto2(isApprove: boolean) {
        this._photo2 = isApprove
    }

    setPhoto3(isApprove: boolean) {
        this._photo3 = isApprove
    }

    setPhoto4(isApprove: boolean) {
        this._photo4 = isApprove
    }

    setPhoto5(isApprove: boolean) {
        this._photo5 = isApprove
    }

    setPhotoVerification(isApprove: boolean) {
        this._photoVerification = isApprove
    }

    setStatusMessage(isApprove: boolean) {
        this._statusMessage = isApprove
    }

    setLongDescription(isApprove: boolean) {
        this._longDescription = isApprove
    }

    setStaffFlagged(isApprove: boolean) {
        this._staffFlagged = isApprove
    }

    setAttempts(numberAttempts: number) {
        this._attempts = numberAttempts
    }

    setLastUpdated(date: string) {
        this._lastUpdated = new Date(date)
    }

    setActioned(value : boolean)
    {
        this._actioned = value
    }

}
