import MemberReport from './MemberReport'


export default interface IMemberReportRepository
{
    // Meta

    findOne(id : number) : Promise<MemberReport>

    allActioned() : Promise<MemberReport[]>

    updateActioned(id : number, value : boolean) : Promise<boolean>

    updateFlagged(id : number, value : boolean) : Promise<boolean>


    // INAPPROPRIATE_PROFILE

    allInappropriateProfiles() : Promise<MemberReport[]>

    allFlaggedInappropriateProfiles() : Promise<MemberReport[]>

    // INAPPROPRIATE_MESSAGES

    allInappropriateMessages() : Promise<MemberReport[]>

    allFlaggedInappropriateMessages() : Promise<MemberReport[]>

    // SPAM_OR_SCAM

    allSpamOrScams() : Promise<MemberReport[]>

    allFlaggedSpamOrScams() : Promise<MemberReport[]>

    // OTHER

    allOthers() : Promise<MemberReport[]>

    allFlaggedOthers() : Promise<MemberReport[]>
}