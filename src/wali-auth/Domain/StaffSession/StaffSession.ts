type StaffSessionPayload = {
    id?: number,
    staffId: number,
    ipAddress: string,
    ipCountryCode: string,
    userAgent : string,
    passwordToken? : string,
    lastActive : string,
    created : string,
    updated : string,
    state : string
}


export default class StaffSession
{
    public lastActive : Date

    public created : Date

    public updated : Date

    public state : string

    constructor(
        public staffId : number, 
        public ipAddress : string, 
        public ipCountryCode : string, 
        public userAgent : string, 
        public passwordToken? : string, 
        lastActive? : string, 
        created? : string, 
        updated? : string, 
        state? : string,
        public id? : number
    ){
        this.lastActive    = lastActive ? new Date(lastActive) : new Date()
        this.created       = created ? new Date(created) : new Date()
        this.updated       = updated ? new Date(updated) : new Date()
        this.state         = state || 'LOGIN'
    }

    static build(payload: StaffSessionPayload) 
    {
        return new StaffSession(
            payload.staffId, 
            payload.ipAddress, 
            payload.ipCountryCode, 
            payload.userAgent, 
            payload.passwordToken, 
            payload.lastActive, 
            payload.created, 
            payload.updated, 
            payload.state,
            payload.id
        )
    }
}