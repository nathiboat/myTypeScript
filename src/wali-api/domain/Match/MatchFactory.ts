import Match from './Match'

type MatchOptions = {
    memberId1 : number,
    memberId2 : number,
    id? : number
}

export default class MatchFactory {

    static build(options : MatchOptions) {
        return new Match(
            options.id,
            options.memberId1,
            options.memberId2
        )
    }
}