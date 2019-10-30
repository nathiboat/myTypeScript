
type MemberApprovePayload = {
    memberId: number,
    staffFlagged: number,
    attempts: number,
    photoOne?: number,
    photoTwo?: number,
    photoThree?: number,
    photoFour?: number,
    photoFive?: number,
    photoVerification?: number,
    statusMessage?: number,
    longDescription?: number,
    lastUpdated?: string,
    actioned?: boolean,
    flagged?: boolean 
}

export default class MemberApprove 
{
    private _actioned : boolean

    private _flagged : boolean

    private constructor(
        public memberId: number,
        public staffFlagged: number,
        public attempts: number,
        public photoOne?: number,
        public photoTwo?: number,
        public photoThree?: number,
        public photoFour?: number,
        public photoFive?: number,
        public photoVerification?: number,
        public statusMessage?: number,
        public longDescription?: number,
        public lastUpdated?: string,
        actioned? : boolean,
        flagged? : boolean) 
    {
        this._actioned = actioned || false
        this._flagged  = flagged || false
    }

    static build(payload: MemberApprovePayload) 
    {
        return new MemberApprove(
            payload.memberId,
            payload.staffFlagged,
            payload.attempts,
            payload.photoOne,
            payload.photoTwo,
            payload.photoThree,
            payload.photoFour,
            payload.photoFive,
            payload.photoVerification,
            payload.statusMessage,
            payload.longDescription,
            payload.lastUpdated,
            payload.actioned,
            payload.flagged
        )
    }

    get actioned()
    {
        return this._actioned
    }

    get flagged()
    {
        return this._flagged
    }

    setActioned(value : boolean)
    {
        this._actioned = value
    }
}