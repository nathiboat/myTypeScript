import { Connection, createConnection } from 'mysql'


export default class BaseRepository
{
    private _connection? : Connection

    private _host : string

    private _database : string

    private _username : string

    private _password : string

    private _port : number


    constructor(host : string, database : string, username : string, password : string, port? : number)
    {
        this._host     = host
        this._database = database
        this._username = username
        this._password = password
        this._port     = port || 3306
    }

    connect()
    {
        let connection = createConnection({
            host:     this._host,
            user:     this._username,
            database: this._database,
            password: this._password,
            port:     this._port
        })
        this._connection = connection
    }

    private _assertConnectionInitialized()
    {
        if(!this._connection)
        {
            throw Error('Connection is not initialized')
        }
    }

    async query(query : string, params? : any[]) : Promise<any>
    {
        this._assertConnectionInitialized()
        return new Promise((resolve, reject)=> {
            this._connection!.query(query, params, (error, result)=> {
                if(error) { return reject(error) }
                return resolve(result)
            })
        })
    }

    get connection()
    {
        return this._connection
    }

    rollback()
    {
        this._assertConnectionInitialized()
        this._connection!.rollback()
        this._connection!.end()
    }

    complete()
    {
        this._assertConnectionInitialized()
        this._connection!.commit()
        this._connection!.end()
    }
}