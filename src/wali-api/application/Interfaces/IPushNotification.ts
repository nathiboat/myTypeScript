interface IPushNotification {
    execute(memberDetail: any, deviceType: string, awsEndpointARN:string, pushType: string, message: string):Promise<any>;
}

export default IPushNotification
