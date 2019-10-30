import Datastore from 'nedb'

type DatabaseDoc = { [key : string] : any }


const getLocalDatabaseContent = async (db : Datastore) : Promise<DatabaseDoc[]> => {
    return new Promise((resolve, reject)=> {
        db.find({}, (error : Error, data : any)=> {
            if(error)
            {
                reject(error)
            } else {
                resolve(data)
            }
        })
    })
}

const removeAllDatabaseDocs = async (db : Datastore) : Promise<number>=> {
    return new Promise((resolve, reject)=> {
        db.remove({}, { multi: true }, (error, data)=> {
            if(error)
            {
                reject(error)
            } else {
                resolve(data)
            }
        })
    })
}

export {
    getLocalDatabaseContent,
    removeAllDatabaseDocs
}