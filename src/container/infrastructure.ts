import { Container } from 'typescript-dependency-injection'
import { SendGridSendEmail, NodemailerSendEmail, AwsSesSendEmail } from './../wali-api/infrastructure/Email'
import { AwsSms, TwilioSms } from './../wali-api/infrastructure/SMS'
import { GenerateRandomPasswordService, GenerateTokenService, CheckTokenService } from './../wali-api/infrastructure/Authenticate'
import { QuestionCollection } from './../wali-api/infrastructure/Persistence/FileSystem'
import { RedisCache, Template } from './../wali-api/infrastructure/Cache'
import { WaliApproveLock, WaliApproveList } from './../wali-api/infrastructure/WaliApproveLock'
import { XmppNotification } from './../wali-api/infrastructure/Notification'
import { Locale } from './../wali-api/infrastructure/Locale'
import { PlatformFactory ,SNSPushNotification} from './../wali-api/infrastructure/SNS'




let container = new Container()

// Setup the env
let isDev = process.env.IS_DEV === undefined || process.env.IS_DEV === 'false' ? false : true


if(!process.env.SGTOKEN) { throw Error('Env values not set for SGTOKEN')}

container.register(AwsSesSendEmail)
         .dependsOnString(process.env.SGTOKEN)


// Register MailTrap as Email Sender only if you are in dev mode
if(isDev)
{
    if(!process.env.MAILTRAP_USER) { throw Error('Env values not set for MAILTRAP_USER')}
    if(!process.env.MAILTRAP_PASSWORD) { throw Error('Env values not set for MAILTRAP_PASSWORD')}

    container.register(NodemailerSendEmail)
             .as('MailTrapSendEmail')
             .dependsOnString(process.env.MAILTRAP_USER)
             .dependsOnString(process.env.MAILTRAP_PASSWORD)
}


if(!process.env.AWS_SMS_KEY) { throw Error('Env values not set for AWS_SMS_KEY')}
if(!process.env.AWS_SMS_SECRET) { throw Error('Env values not set for AWS_SMS_SECRET')}

container.register(AwsSms)
         .dependsOnString(process.env.AWS_SMS_KEY)
         .dependsOnString(process.env.AWS_SMS_SECRET)
         .dependsOnString('us-east-1')


if(!process.env.TWILIO_ACCOUNT_SID) { throw Error('Env values not set for TWILIO_ACCOUNT_SID')}
if(!process.env.TWILIO_AUTH_TOKEN) { throw Error('Env values not set for TWILIO_AUTH_TOKEN')}
if(!process.env.TWILIO_FROM_NUMBER) { throw Error('Env values not set for TWILIO_FROM_NUMBER')}

container.register(TwilioSms)
         .dependsOnString(process.env.TWILIO_ACCOUNT_SID)
         .dependsOnString(process.env.TWILIO_AUTH_TOKEN)
         .dependsOnString(process.env.TWILIO_FROM_NUMBER)
         .dependsOnString('us-east-1')

container.register(GenerateRandomPasswordService)
         .dependsOnNumber(6)
         .dependsOnBoolean(true)
         .dependsOnBoolean(true)


if(!process.env.JWT_SECRET) { throw Error('Env values not set for JWT_SECRET') }
if(!process.env.JWT_EXPIRES_IN) { throw Error('Env values not set for JWT_EXPIRES_IN') }

container.register(GenerateTokenService)
         .dependsOnString(process.env.JWT_SECRET)
         .dependsOnNumber(parseInt(process.env.JWT_EXPIRES_IN))


container.register(CheckTokenService)
         .dependsOnString(process.env.JWT_SECRET)

container.register(QuestionCollection)


if(!process.env.REDIS_HOST) { throw Error('Env values not set for REDIS_HOST') }
if(!process.env.REDIS_PORT) { throw Error('Env values not set for REDIS_PORT') }
if(!process.env.REDIS_PREFIX) { throw Error('Env values not set for REDIS_PREFIX')}

container.register(RedisCache)
         .dependsOnString(process.env.REDIS_HOST)
         .dependsOnNumber(parseInt(process.env.REDIS_PORT) )
         .dependsOnString(process.env.REDIS_PREFIX)

container.register(WaliApproveLock)
         .dependsOnString( Template.generate('WALI_APPROVE_LIST_LOCKED') )
         .dependsOnClass('RedisCache')



let waliLockList = container.register(WaliApproveList)
         .dependsOnString( Template.generate('WALI_APPROVE_LIST') )
         .dependsOnClass('RedisCache')

if(process.env.WALI_LIST_EXPIRE)
{
    waliLockList.dependsOnNumber(parseInt(process.env.WALI_LIST_EXPIRE))
}


if(!process.env.XMPP_HOST) { throw Error('Env value not set for XMPP_HOST')}
if(!process.env.XMPP_JID) { throw Error('Env values not set for XMPP_JID')}
if(!process.env.XMPP_PASSWORD) { throw Error('Env values not set for XMPP_PASSWORD')}
if(!process.env.XMPP_PORT) { throw Error("Env values not set for XMPP_PORT")}

container.register(XmppNotification)
         .dependsOnString(process.env.XMPP_JID)
         .dependsOnString(process.env.XMPP_HOST)
         .dependsOnString(process.env.XMPP_PASSWORD)
         .dependsOnString(process.env.XMPP_PORT)
         .dependsOnBoolean(true)

if(!process.env.LOCALE_PATH) { throw Error('Env value not set for LOCALE_PATH')}

container.register(Locale)
         .dependsOnString(process.env.LOCALE_PATH)

if(!process.env.SNS_ACCESS_USERNAME) { throw Error('Env value not set for SNS_ACCESS_USERNAME')}
if(!process.env.SNS_ACCESS_PASSWORD) { throw Error('Env value not set for SNS_ACCESS_PASSWORD')}

container.register(SNSPushNotification)
         .dependsOnClass('PlatformFactory')
         .dependsOnString(process.env.SNS_ACCESS_USERNAME)
         .dependsOnString(process.env.SNS_ACCESS_PASSWORD)

if(!process.env.SNS_ANDROID_ENDPOINT_ARN_PREFIX) { throw Error('Env value not set for SNS_ANDROID_ENDPOINT_ARN_PREFIX')}
if(!process.env.SNS_IOS_ENDPOINT_ARN_PREFIX) { throw Error('Env value not set for SNS_IOS_ENDPOINT_ARN_PREFIX')}

container.register(PlatformFactory)
         .dependsOnString(process.env.SNS_ANDROID_ENDPOINT_ARN_PREFIX)
         .dependsOnString(process.env.SNS_IOS_ENDPOINT_ARN_PREFIX)


if(!process.env.AMAZON_SES_ACCESS_KEY) { throw Error('Env value not set for AMAZON_SES_ACCESS_KEY') }
if(!process.env.AMAZON_SES_SECRET) { throw Error('Env value not set for AMAZON_SES_SECRET') }
if(!process.env.AMAZON_SES_REGION) { throw Error('Env value not set for AMAZON_SES_REGION') }

container.register(AwsSesSendEmail)
         .dependsOnString(process.env.AMAZON_SES_ACCESS_KEY)
         .dependsOnString(process.env.AMAZON_SES_SECRET)
         .dependsOnString(process.env.AMAZON_SES_REGION)

export default container
