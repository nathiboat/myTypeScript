export default class Match {

    private _id? : number
    
    private _memberId1? : number

    private _memberId2? : number


    constructor (
        id? : number,
        memberId1? : number,
        memberId2? : number
    ) {
        this._id = id
        this._memberId1 = memberId1
        this._memberId2 = memberId2   
    }

    get id() 
    {
        return this._id 
    }

}