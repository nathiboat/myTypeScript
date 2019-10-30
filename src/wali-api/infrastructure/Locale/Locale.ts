import { ILocale } from './../../application'
import Param from './ParamType'


type Translation = { [key : string] : string }


export default class Locale implements ILocale
{
    private _path : string

    private _defaultLanguage : string

    constructor(path : string, defaultLanguage? : string)
    {
        this._path = path
        this._defaultLanguage = defaultLanguage ? defaultLanguage : 'en'
    }

    private async initialize(countryCode : string) {

        // If provided language does not exist, fallback to the default language
        try {
            return await import(`${ this._path }/locale-${ countryCode }.json`)
        } catch(err) {
            return await import(`${ this._path }/locale-${ this._defaultLanguage }.json`)
        }
    }

    async key(countryCode : string, key : string, params? : Param) : Promise<string>
    {
        // 1. Initialize the state of the object
        let translations = await this.initialize(countryCode)

        // 2. Check if the key exists
        this.assertValidKey(translations, key)

        // 3. Get the value of the key
        let found = translations[ key ]

        // 4. Find and replace params
        if(params !== undefined)
        {
            Object.keys(params).forEach((key)=> {
                found = found.split(`%${ key }`).join(params[key].toString())
            })
        }

        // 5. Return the key
        return found
    }

    isValidOrDefault(languageCode? : string) : string
    {
        return languageCode || this._defaultLanguage
    }

    private assertValidKey(translations : Translation[], key : string)
    {
        if(!Object.keys(translations).includes(key))
        {
            throw Error(`Could not find key ${ key }`)
        }
    }

    get defaultLanguage() {
        return this._defaultLanguage
    }
}
