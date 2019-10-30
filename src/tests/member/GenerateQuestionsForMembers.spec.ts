import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Datastore from 'nedb'

// Set up the test, container, dependencies
import container from './../../container'
import { GenerateQuestionsForMembers, GenerateQuestionsResponse } from './../../wali-api/application'
import { WaliApproveLock } from './../../wali-api/infrastructure/WaliApproveLock'
import { LocalInsertStaffLogCommand } from './../LocalPersistence'

// Create the databases
let db : { [key : string] : Datastore } = {}

db.staffLogs  = new Datastore()


const getService = ()=> {

    let redis = container.get('RedisCache')
    return new GenerateQuestionsForMembers(
        container.get('SelectApprovalPendingMemberIdsQuery'),
        container.get('SelectMemberByIdQuery'),
        container.get('QuestionCollection'),
        new WaliApproveLock('new-fake-list', redis),
        container.get('WaliApproveList'),
        new LocalInsertStaffLogCommand(db.staffLogs),
        new GenerateQuestionsResponse()
    )
}


describe('Test GenerateQuestionsForMembers', ()=> {
    it('Should return a list of Questions generated from a random member profile', async ()=> {

        let generateQuestions = getService()

        let result = await generateQuestions.execute(1)

        expect(result!.member).to.be.a('string')
        expect(result!.questions).to.be.a('array')
    })
})

