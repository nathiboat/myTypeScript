type Params = { [key : string] : string | number | boolean }

type Keys = { [key : string] : string }


export default class CacheKeyService
{
    private _templates : Keys = {

        // PICKED UP TASKS BY STAFFS - Used to store the tasks that have been picked up by staff members
        // Unflagged tasks
        WALI_TASK_APPROVE_LOCKED: 'v1:wali:task:approve:locked',
        // WALI_TASK_REPORT_LOCKED: 'v1:wali:task:report:locked',

        WALI_TASK_INAPPROPRIATE_PROFILE_REPORT_LOCKED: 'v1:wali:task:inappropriate-profile-report:locked',
        WALI_TASK_INAPPROPRIATE_MESSAGES_REPORT_LOCKED: 'v1:wali:task:inappropriate-message-report:locked',
        WALI_TASK_SPAM_OR_SCAM_REPORT_LOCKED: 'v1:wali:task:spam-or-scam-report:locked',
        WALI_TASK_OTHER_REPORT_LOCKED: 'v1:wali:task:other-report:locked',

        // WALI_TASK_BLOCK_LOCKED: 'v1:wali:task:block:locked',
        WALI_TASK_ISSUE_LOCKED: 'v1:wali:task:issue:locked',

        // Flagged tasks
        WALI_TASK_APPROVE_FLAG_LOCKED: 'v1:wali:task:approve:flag:locked',
        // WALI_TASK_REPORT_FLAG_LOCKED: 'v1:wali:task:report:flag:locked',
        // WALI_TASK_BLOCK_FLAG_LOCKED: 'v1:wali:task:block:flag:locked',

        WALI_TASK_INAPPROPRIATE_PROFILE_REPORT_FLAG_LOCKED: 'v1:wali:task:inappropriate-profile-report:flag:locked',
        WALI_TASK_INAPPROPRIATE_MESSAGES_REPORT_FLAG_LOCKED: 'v1:wali:task:inappropriate-message-report:flag:locked',
        WALI_TASK_SPAM_OR_SCAM_REPORT_FLAG_LOCKED: 'v1:wali:task:spam-or-scam-report:flag:locked',
        WALI_TASK_OTHER_REPORT_FLAG_LOCKED: 'v1:wali:task:other-report:flag:locked',

        WALI_TASK_ISSUE_FLAG_LOCKED: 'v1:wali:task:issue:flag:locked',


        // LISTS - Used to store all the tasks in the database in the cache
        // Lists of tasks
        WALI_QUEUE_APPROVE: 'v1:wali:queue:approve',
        // WALI_QUEUE_REPORT: 'v1:wali:queue:report',
        // WALI_QUEUE_BLOCK: 'v1:wali:queue:block',

        WALI_QUEUE_INAPPROPRIATE_PROFILE_REPORT: 'v1:wali:queue:inappropriate-profile-report',
        WALI_QUEUE_INAPPROPRIATE_MESSAGES_REPORT: 'v1:wali:queue:inappropriate-message-report',
        WALI_QUEUE_SPAM_OR_SCAM_REPORT: 'v1:wali:queue:spam-or-scam-report',
        WALI_QUEUE_OTHER_REPORT: 'v1:wali:queue:other-report',

        WALI_QUEUE_ISSUE: 'v1:wali:queue:issue',

        // List of flagged tasks
        WALI_QUEUE_APPROVE_FLAG: 'v1:wali:queue:approve:flag',
        // WALI_QUEUE_REPORT_FLAG: 'v1:wali:queue:report:flag',
        // WALI_QUEUE_BLOCK_FLAG: 'v1:wali:queue:block:flag',

        WALI_QUEUE_INAPPROPRIATE_PROFILE_REPORT_FLAG: 'v1:wali:queue:inappropriate-profile-report:flag',
        WALI_QUEUE_INAPPROPRIATE_MESSAGES_REPORT_FLAG: 'v1:wali:queue:inappropriate-message-report:flag',
        WALI_QUEUE_SPAM_OR_SCAM_REPORT_FLAG: 'v1:wali:queue:spam-or-scam-report:flag',
        WALI_QUEUE_OTHER_REPORT_FLAG: 'v1:wali:queue:other-report:flag',

        WALI_QUEUE_ISSUE_FLAG: 'v1:wali:queue:issue:flag',


        // INDIVIDUAL LOCKS - Used to store a lock key for race concurrency
        // Individual lock
        WALI_QUEUE_APPROVE_LOCK: 'v1:wali:queue:approve:lock',
        // WALI_QUEUE_REPORT_LOCK: 'v1:wali:queue:report:lock',
        // WALI_QUEUE_BLOCK_LOCK: 'v1:wali:queue:block:lock',

        WALI_QUEUE_INAPPROPRIATE_PROFILE_REPORT_LOCK: 'v1:wali:queue:inappropriate-profile-report:lock',
        WALI_QUEUE_INAPPROPRIATE_MESSAGES_REPORT_LOCK: 'v1:wali:queue:inappropriate-message-report:lock',
        WALI_QUEUE_SPAM_OR_SCAM_REPORT_LOCK: 'v1:wali:queue:spam-or-scam-report:lock',
        WALI_QUEUE_OTHER_REPORT_LOCK: 'v1:wali:queue:other-report:lock',

        WALI_QUEUE_ISSUE_LOCK: 'v1:wali:queue:issue:lock',

        // Individual flagged lock
        WALI_QUEUE_APPROVE_FLAG_LOCK: 'v1:wali:queue:approve:flag:lock',
        // WALI_QUEUE_REPORT_FLAG_LOCK: 'v1:wali:queue:report:flag:lock',
        // WALI_QUEUE_BLOCK_FLAG_LOCK: 'v1:wali:queue:block:flag:lock',

        WALI_QUEUE_INAPPROPRIATE_PROFILE_REPORT_FLAG_LOCK: 'v1:wali:queue:inappropriate-profile-report:flag:lock',
        WALI_QUEUE_INAPPROPRIATE_MESSAGES_REPORT_FLAG_LOCK: 'v1:wali:queue:inappropriate-message-report:flag:lock',
        WALI_QUEUE_SPAM_OR_SCAM_REPORT_FLAG_LOCK: 'v1:wali:queue:spam-or-scam-report:flag:lock',
        WALI_QUEUE_OTHER_REPORT_FLAG_LOCK: 'v1:wali:queue:other-report:flag:lock',

        WALI_QUEUE_ISSUE_FLAG_LOCK: 'v1:wali:queue:issue:flag:lock'
    }
    
    private _prefix : string


    constructor(prefix : string)
    {
        this._prefix = prefix
    }

    get templates() : string[]
    {
        return Object.keys(this._templates)
    }

    generate(key : string, params? : Params) : string
    {
        // 1, Find key if it exists
        let template = this.exists(key)

        // 3. Replace template with dinamic params
        if(params)
        {
            return this.replace(template, params)
        }
        return this.addKeyPrefix(template)
    }

    private addKeyPrefix(key : string) 
    {
        return this._prefix + ':' + key
    }

    private exists(key : string) : string
    {
        let found = this._templates[key]

        if(!found)
        {
            throw Error(`Could not find key ${ key }`)
        }

        return found
    }

    private replace(template : string, params : Params)
    {
        this.assertNoMissingParams(template, params)
        
        Object.keys(params).forEach((keyParam)=> {
            template = template.replace(`$${ keyParam.toUpperCase() }`, params[keyParam].toString())
        })
        return template
    }

    private assertNoMissingParams(template : string, params : Params)
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
