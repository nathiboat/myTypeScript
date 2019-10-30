export default class SendLoginPasswordEmail
{
    private _subject : string

    private _content : string

    private _html : string

    constructor(name : string, password : string)
    {
        this._subject = `${ password } is your email verification code`

        this._content = `
            ${ password }

            If this was you, use the above code to complete your Wali log in. Then feel free to delete this email.

            If this was not you then please let the muzmatch team know, either by replying to this email immediately or contacting us via Slack.
        `

        this._html = `
        <div style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;color:#222!important;margin-left:auto;margin-right:auto;max-width:620px!important;padding:0 10px">
            <p style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;max-width:620px;font-size:20px!important;margin:10px auto;line-height:32px">
                <code style="font-family:Menlo-Regular,monospace!important">${ password }</code>
            </p>
            <p style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;max-width:620px;font-size:20px!important;margin:10px auto;line-height:32px">If this was you, use the above code to complete your Wali log in. Then feel free to delete this email.</p>
            <p style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;max-width:620px;font-size:20px!important;margin:10px auto;line-height:32px">If this was not you then please let the muzmatch team know, either by replying to this email immediately or contacting us via Slack.</p>

            <p style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;max-width:620px;font-size:20px!important;margin:10px auto;line-height:32px">
                <a href="https://muzmatch.com/open?ref=email&amp;utm_source=transactional&amp;utm_campaign=transactional&amp;utm_medium=email&amp;emailID=%7B%7BemailID%7D%7D" class="m_715271720914443288m_8777586542751546540button" style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;text-decoration:none!important;color:#fff!important;font-weight:700!important;text-align:center;background-color:#fb406c!important;border:none;padding:11px 32px;display:inline-block;font-size:16px!important;border-radius:26px!important;margin:15px auto 50px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://muzmatch.com/open?ref%3Demail%26utm_source%3Dtransactional%26utm_campaign%3Dtransactional%26utm_medium%3Demail%26emailID%3D%257B%257BemailID%257D%257D&amp;source=gmail&amp;ust=1566983801177000&amp;usg=AFQjCNF8gzmqrIB1bR7x2pnwgiqMEjQWqg">
                    OPEN MUZMATCH
                </a>
            </p>


            <p style="font-family:Helvetica,Arial,sans-serif!important;max-width:620px;font-size:16px!important;margin:30px auto 30px 0!important;line-height:32px;color:#9da299;margin-bottom:15px">
                <img src="https://ci3.googleusercontent.com/proxy/v8raeHeOOZxC7LWmIgglDYTonvPncnJbW74OqCKevkfAGoOre1LWRuQsnFBTKtXIb9JcBovO6A5ELYDOxG8k-RT7zQ=s0-d-e1-ft#https://muzmatch.com/images/email/Divider@2x.png" style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;margin-top:0;margin-bottom:0;height:2px!important;width:18px!important">
            </p>
            <p style="font-family:Helvetica,Arial,sans-serif!important;max-width:620px;font-size:16px!important;margin:10px auto;line-height:32px;color:#9da299;margin-bottom:15px">
                Sent with ♥ from muzmatch
            </p>
            <p style="font-family:Helvetica,Arial,sans-serif!important;max-width:620px;font-size:16px!important;margin:10px auto;line-height:32px;color:#9da299;margin-bottom:15px">
                <a href="https://facebook.com/muzmatch" style="font-family:Helvetica,Arial,sans-serif!important;text-decoration:none!important;color:#9da299!important;font-weight:400!important;font-size:16px!important;max-width:500px;margin-left:0;margin-bottom:15px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://facebook.com/muzmatch&amp;source=gmail&amp;ust=1566983801177000&amp;usg=AFQjCNFSgqJdXQDcq_LjIN9a7LA5hja_Qg">
                    <img src="https://ci5.googleusercontent.com/proxy/He_wwY-X-dqe5t-aXpP3AaCjg1SxIAInEkgeYj3RrdkM83TY2dj_vLqDzTyPoPCg7q9q_a0KY6TiHlrih-ZaZ0u_pw4=s0-d-e1-ft#https://muzmatch.com/images/email/Facebook@2x.png" alt="" class="m_715271720914443288m_8777586542751546540facebook CToWUd" style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;margin-top:0;margin-bottom:0;height:18px!important;width:auto!important;margin-right:7px">
                </a>
                <a href="https://twitter.com/muzmatch" style="font-family:Helvetica,Arial,sans-serif!important;text-decoration:none!important;color:#9da299!important;font-weight:400!important;font-size:16px!important;max-width:500px;margin-left:0;margin-bottom:15px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/muzmatch&amp;source=gmail&amp;ust=1566983801177000&amp;usg=AFQjCNEOkXrhbGZmgQOroM6tgKK51J-6TQ">
                    <img src="https://ci5.googleusercontent.com/proxy/OsUFa1SrKAzoF5PgRDXlbKUp8oka5ZR-vQBhOTgNhj9YKwWubZgi2hRWgikVwlwN3F8YUDigpmNQdOZBQZhOEE21iw=s0-d-e1-ft#https://muzmatch.com/images/email/Twitter@2x.png" alt="" class="m_715271720914443288m_8777586542751546540twitter CToWUd" style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;margin-top:0;margin-bottom:0;height:18px!important;width:auto!important;margin-right:4px">
                </a>
                <a href="https://instagram.com/muzmatch" style="font-family:Helvetica,Arial,sans-serif!important;text-decoration:none!important;color:#9da299!important;font-weight:400!important;font-size:16px!important;max-width:500px;margin-left:0;margin-bottom:15px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/muzmatch&amp;source=gmail&amp;ust=1566983801177000&amp;usg=AFQjCNGlb9Wkpk5c5amrrjmEpgNihCNGkg">
                    <img src="https://ci6.googleusercontent.com/proxy/8WvMqVZQzttjq0wqpARVMWcH70YuObqImoSFDK7-j6Q_FEj8rFqQQNd_Zk5AhzVkh03BR8C4qnGsPF2AK7E2vaPgADLN=s0-d-e1-ft#https://muzmatch.com/images/email/Instagram@2x.png" alt="" class="m_715271720914443288m_8777586542751546540instagram CToWUd" style="font-family:Avenir,Avenir,Helvetica,Arial,sans-serif!important;margin-top:0;margin-bottom:0;height:18px!important;width:auto!important">
                </a>
            </p>
        </div>
        `
    }

    get subject()
    {
        return this._subject
    }

    get content()
    {
        return this._content
    }

    get html()
    {
        return this._html
    }
}
