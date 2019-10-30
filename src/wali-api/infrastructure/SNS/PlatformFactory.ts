export default class PlatformFactory
{
    private _devicePlatform = {
        android: {
            publisher: "GCM",
            prefix: ''
        },
        iOS: {
            publisher: "APNS",
            prefix: ''
        }
    }

    constructor(androidEndpointPrefix: string, iosEndpointPrefix: string)
    {
        this._devicePlatform.iOS.prefix = iosEndpointPrefix
        this._devicePlatform.android.prefix = androidEndpointPrefix
    }

    getArnEndpointPrefix (deviceType: string)
    {
        this.deviceValidate(deviceType)
        switch (deviceType) {
            case 'android':
                return this._devicePlatform.android.prefix
            case 'iOS':
                return this._devicePlatform.iOS.prefix
        }
    }

    getSNSPublisher (deviceType: string) : string
    {
        this.deviceValidate(deviceType)
        switch (deviceType) {
            case 'android':
                return this._devicePlatform.android.publisher
            case 'iOS':
                return this._devicePlatform.iOS.publisher
            default:
                return this._devicePlatform.iOS.publisher
        }
    }

    private deviceValidate(deviceType: string)
    {
        if (!['iOS', 'android'].includes(deviceType)) {
            throw Error(`Unknown device : ${ deviceType }`)
        }
    }
}
