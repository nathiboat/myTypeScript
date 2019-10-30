type Param = { [key : string] : number | boolean | string }

interface ILocale
{
    key(countryCode : string, key : string, params? : Param) : Promise<string>

    isValidOrDefault(languageCode? : string) : string

    readonly defaultLanguage : string


}

export default ILocale
