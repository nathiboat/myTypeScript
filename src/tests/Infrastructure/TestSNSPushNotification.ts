import AWS from 'aws-sdk'
import PlatformFactory from './../../wali-api/infrastructure/SNS/PlatformFactory'
import { IPushNotification } from './../../wali-api/application'


type deviceOption = {
    SCREEN_TO_LOAD : string | null,
    URL : string | null,
    message: string | null,

    // Leave it for future investigation
    //SOUND: number,
    //VIBRATE: number,
    //badge: number,
    //aps: { badge: number, alert: number, sound: number}
}

export default class TestSNSPushNotification implements IPushNotification
{
    private _client : AWS.SNS
    private _region =  'eu-west-1'
    private _devicePlatform : PlatformFactory


    private _pushType : string[] = [
        'NEW_LIKE',
        'SILENT_LIKE',
        'SILENT_TEST',
        'PROFILE_VIEW',
        'ADMIN_MESSAGE',
        'NEW_MESSAGE',
        'CHAT_REMINDER',
        'USAGE_REMINDER',
        'ADD_TO_PROFILE_REMINDER'
    ]

    constructor(deviceFactory: PlatformFactory, accessKeyId : string, secretAccessKey : string)
    {
        var config = new AWS.Config({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: this._region
        })
        this._client = new AWS.SNS(config)
        this._devicePlatform = deviceFactory
    }

    async execute(memberDetail: any, deviceType: string, awsEndpointARN:string, pushType: string, message: string) : Promise<any>
    {
        let targetArn = this.buildTargetArn(deviceType, awsEndpointARN)
        let mobilePayload = this.buildMobilePayload(memberDetail, pushType, deviceType, message)
        let params = {
            Message: JSON.stringify(this.generateMessage(mobilePayload, deviceType)),
            MessageStructure: 'json',
            TargetArn: targetArn
        }
        // return this._client.publish(params).promise()
        return params
    }

    private buildTargetArn(deviceType : string, awsEndpoint : string) : string
    {

        if(!['iOS', 'android'].includes(deviceType))
        {
            throw Error(`Unknown device type: ${ deviceType }`)
        }

        return this.getEndpointPrefix(deviceType) + awsEndpoint
    }

    private getEndpointPrefix(deviceType: string)
    {
       return this._devicePlatform.getArnEndpointPrefix(deviceType)
    }

    private getDevicePublisher(deviceType : string): string
    {
       return this._devicePlatform.getSNSPublisher(deviceType)
    }

    private generateMessage(payload: deviceOption, deviceType: string)
    {
        let data = {data: payload}

        let publisher = this.getDevicePublisher(deviceType)

        let finalMessage : {[key : string] : any} = {}

        finalMessage[publisher] = JSON.stringify(data)

        return finalMessage
    }

    private buildMobilePayload (memberDetail: any, pushType: string, deviceType: string, message: string)
    {

        let payload : deviceOption = { message: message, SCREEN_TO_LOAD: '', URL: ''}

        switch (pushType !== undefined ? pushType : null )
        {

            case 'SILENT_LIKE':
                payload.SCREEN_TO_LOAD = 'SILENT_LIKE'
                break
            case 'ADMIN_MESSAGE':
            case 'NEW_MESSAGE':
            case 'CHAT_REMINDER':
            case 'ADD_TO_PROFILE_REMINDER':

                // Legacy key
                payload.SCREEN_TO_LOAD = 'CHAT_SCREEN'

                // Modern URL scheme
                if (memberDetail && memberDetail.matchId) {
                    payload.URL = `https://muzmatch.com/matches/${memberDetail.matchId}?source=PUSH`
                } else {
                    payload.URL = "https://muzmatch.com/matches?source=PUSH"
                }

                break
            case 'NEW_LIKE':

                // Legacy key
                payload.SCREEN_TO_LOAD = 'PROFILE_HISTORY';

                // Modern URL scheme
                if (memberDetail && memberDetail.otherMemberId) {
                    payload.URL = `https://muzmatch.com/explore/new-likes/${memberDetail.otherMemberId}?source=PUSH`
                } else {
                    payload.URL = "https://muzmatch.com/explore?source=PUSH"
                }

                break
            case 'PROFILE_VIEW':

                // Legacy key
                payload.SCREEN_TO_LOAD = 'PROFILE_VIEW'

                // Modern URL scheme
                if (memberDetail && memberDetail.otherMemberId) {
                    payload.URL = "https://muzmatch.com/explore/visited-you/$otherMemberID?source=PUSH"
                } else {
                    payload.URL = "https://muzmatch.com/explore?source=PUSH"
                }
                break

            default:
                payload.SCREEN_TO_LOAD = 'MAIN_SPLASH'
                payload.URL = "https://muzmatch.com?source=PUSH"
        }

        return payload
    }
}
