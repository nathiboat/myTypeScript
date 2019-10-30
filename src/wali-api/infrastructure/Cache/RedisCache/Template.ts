type Params = { [key : string] : string | number | boolean }

type Keys = { [key : string] : string }


export default abstract class Template
{
    private static _templates : Keys = {
        USER_AUTH:              'v1:members:auth:$TOKEN-$UDID', // JSON-encoded memberID for this auth session
        USER_SEARCH_FILTERS:    'v1:members:filters:$ID', // JSON-encoded dictionary of search filters
        SEARCH_FILTERS_DENSITY: 'v1:search-filters:density:$TYPE:$RANGE', // JSON-encoded density percentages

        MEMBER:                 'v1:members:$ID', // JSON-encoded dump of raw user data
        MEMBER_LAST_ACTIVE:     'v1:members:$ID:last_active', // Last UNIX timeStamp of when the member was last active
        MEMBER_MATCHED_WITH:    'v1:members:$ID:matched_with', // Hash of memberID: matchID
        MEMBER_PREMIUM_ORIGINS: 'v1:members:$ID:premium_origins', // Hash of memberID: premiumOrigin
        MEMBER_SWIPE_RATIO:     'v1:members:$ID:swipe_ratio', // List of 'true'/'false' values

        ACTIVITY_LIKED_YOU:   'v1:activity:$ID:liked_you:$FILTER', // ZSet of memberIDs who liked $ID with filter
        ACTIVITY_VISITED_YOU: 'v1:activity:$ID:visited_you', // ZSet of memberIDs who visited $ID
        ACTIVITY_LIKED:       'v1:activity:$ID:liked', // ZSet of memberIDs liked by $ID
        ACTIVITY_PASSED:      'v1:activity:$ID:passed', // ZSet of memberIDs passed by $ID
        ACTIVITY_FAVOURITED:  'v1:activity:$ID:favourited', // ZSet of memberIDs favourited by $ID
        ACTIVITY_BLOCKED:     'v1:activity:$ID:blocked', // ZSet of memberIDs blocked by $ID
        USER_BLOCKED_SET:     'v1:members:$ID:blocked', // Set of memberIDs who $ID cannot see

        MATCHES_ALL:      'v1:members:matches:$ID:all', // ZSet of memberIDs (un)matched with $ID, scored by last message time
        MATCHES_NEW:      'v1:members:matches:$ID:new', // ZSet of memberIDs matched with $ID, scored by match time
        MATCHES_EXISTING: 'v1:members:matches:$ID:existing', // ZSet of memberIDs matched with $ID
        UNMATCHES_ALL:    'v1:members:matches:$ID:unmatched', // ZSet of memberIDs unmatched with $ID

        COUNTRIES:              'v1:countries',
        COUNTRIES_LOCALE:       'v1:countries:locale-$LOCALE',
        COUNTRY:                'v1:countries:$ID',
        COUNTRY_BY_CODE:        'v1:countries:code:$CODE',
        CITY_GEONAMES:          'v1:city_geonames',
        CITY_GEONAMES_LOCALE:   'v1:city_geonames:locale-$LOCALE',
        CITY_GEONAME:           'v1:city_geonames:$ID',
        PROFESSIONS:            'v1:professions',
        PROFESSIONS_LOCALE:     'v1:professions:locale-$LOCALE',
        PROFESSION:             'v1:profession:$ID',
        ETHNICGROUPINGS:        'v1:ethnicgroupings',
        ETHNICGROUPINGS_LOCALE: 'v1:ethnicgroupings:locale-$LOCALE',
        ETHNICGROUPING:         'v1:ethnicgrouping:$ID',
        LANGUAGES:              'v1:languages',
        LANGUAGES_LOCALE:       'v1:languages:locale-$LOCALE',
        LANGUAGE:               'v1:language:$ID',
        LANGUAGE_BY_CODE:       'v1:language:code:$CODE',

        IP_STACK: 'v1:ip-stack:$ADDRESS',

        MATCH:                     'v1:matches:$ID', // JSON-encoded dump of raw match data
        MATCH_ADMIN_TICKET_OPENED: 'v1:matches:admin:ticket-opened:$ID',

        STAFF:      'v1:staff:$ID',
        STAFF_AUTH: 'v1:staff:auth:$TOKEN',

        WALI_APPROVE_LIST: 'v1:wali:approve:list',
        WALI_APPROVE_LOCK: 'v1:wali:approve:lock:$MEMBERID',
        WALI_APPROVE_LIST_LOCKED: 'v1:wali:approve:list:locked',
    }

    static generate(key : string, params? : Params) : string
    {
        // 1, Find key if it exists
        let template = this.exists(key)

        // 3. Replace template with dinamic params
        if(params)
        {
            return this.replace(template, params)
        }
        return template
    }

    private static exists(key : string) : string {

        let found = this._templates[key]

        if(!found)
        {
            throw Error('Could not find template key')
        }

        return found
    }

    private static replace(template : string, params : Params)
    {
        this.assertNoMissingParams(template, params)

        Object.keys(params).forEach((keyParam)=> {
            template = template.replace(`$${ keyParam.toUpperCase() }`, params[keyParam].toString())
        })
        return template
    }

    private static assertNoMissingParams(template : string, params : Params)
    {
        let found : RegExpMatchArray | null = template.match(/[$A-Z]+/g)

        if(found === null)
        {
            throw Error('Supplied params do not match the template replaceble params')
        }

        let upperCaseKeys = Object.keys(params).map(key => key.toUpperCase())

        found.map((item)=> {
            let noPrefixKey = item.replace('$', '')
            if(!upperCaseKeys.includes(noPrefixKey))
            {
                throw Error(`Missing param ${ noPrefixKey }`)
            }
        })
    }
}
