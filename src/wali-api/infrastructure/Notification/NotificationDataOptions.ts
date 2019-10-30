type NotificationDataOptions = { 
    nickname: string,
    age: number,
    thumbnail: string,
    profileSummary: string,
    professionName: string,
    GPSderivedCountryName: string,
    GPSderivedLocationName: string,
    messageType: string,
    messageID?: string,
    isNewMatch: boolean,
    wasInstantMatch: boolean,
    requiresInstantMatchAcceptance: string,
    matchStatus: string,
    type: string, 
    matchID: number,
    memberID?: number,
    xmlns: string,
    timeStamp: Date,
    URL?: string,
    matchSTATUS: string,
    instantMatchMemberID?: number,
    newMatch: false,
    locale: string
}

export default NotificationDataOptions