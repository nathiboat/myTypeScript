
import { Client } from 'node-xmpp-client'
import { INotification } from './../../wali-api/application'
import { Message, Member } from './../../wali-api/domain'


export default class TestXmppNotification implements INotification 
{

    private _jid : string

    private _host : string

    private _password : string

    private _port : number 

    private _client? : Client


    constructor(jid : string, host : string, password : string, port: number) {
        this._jid = jid
        this._host = host
        this._password = password
        this._port = port      
    }

    send(messages : Message[], member : Member, senderProfile : { [key : string] : any }, debug? : boolean) {

        this._client = new Client({
            jid: this._jid,
            host: this._host,
            password: this._password,
            port: this._port,
        })

        this._client.on('online', () => {

			messages.forEach((message) => {

				var stanza = new Client.Stanza('message', {to: member.hashId + '@' + this._host, type: 'chat'})
					.c('body').t(message.body).up()
					.c('data', {
						nickname: senderProfile.nickname,
						age: senderProfile.age,
						thumbnail: senderProfile.thumbnail,
						profileSummary: senderProfile.profileSummary,
						professionName: senderProfile.professionName,
						GPSderivedCountryName: senderProfile.GPSderivedCountryName,
						GPSderivedLocationName: senderProfile.GPSderivedLocationName,
						messageType: message.messageType,
						messageID: message.messageId,
						isNewMatch: false,
						wasInstantMatch: false,
						requiresInstantMatchAcceptance: '',
						matchStatus: 'MATCHED',
						type: 'chat',
						memberID: message.senderMemberId,
						matchID: message.matchId,
						xmlns: "muzmatch:data",
						timeStamp: message.timeStamp,
						instantMatchMemberID: message.memberId,
						matchSTATUS: 'MATCHED',
						newMatch: false,
						locale: 'EN'
					}).up()

				try {

					if (this._client) {
						this._client.send(stanza)
				    }
				}catch(err) { 
					console.log(err)
				}
			})

		})

        this._client.on('error', function(err) {
            throw Error(err)
        });

        if (debug) {

            this._client.on('online', (data) => {
                console.log('Connected as ' + data.jid.local + '@' + data.jid.domain + '/' + data.jid.resource)
            })

            this._client.on(('stanza'), (stanza) => {
                console.log('Incoming stanza: ', stanza.toString())
            })

            this._client.on('offline',  () =>  {
                console.log('Client is offline')
            })
              
            this._client.on('connect', function () {
                console.log('Client is connected')
            })
              
            this._client.on('reconnect', function () {
                console.log('Client reconnects …')
            })
              
            this._client.on('disconnect', function (e) {
                console.log('Client is disconnected', e)
            })

         }
    }
}