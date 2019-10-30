import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { expect } from 'chai'
import 'mocha'
import Datastore from 'nedb'
import container from './../../container'
import { LocalUpdateMemberApprovalCommand } from './../LocalPersistence'

let db : { [key : string] : Datastore } = {}

db.members = new Datastore()


const getFlagMemberService = () => {
    return new FlagMemberService(
        container.get('MemberDB.Queries.SelectMemberByHashIdQuery'),
        container.get('MemberDB.Queries.SelectMemberApprovalByIdQuery'),
        new LocalUpdateMemberApprovalCommand(db.members),
        container.get('MemberDB.Commands.InsertMemberApprovalCommand'),
        container.get('WaliApproveList')
    )
}

import FlagMemberService from "../../wali-api/application/Member/FlagMemberService"
import {getLocalDatabaseContent, removeAllDatabaseDocs} from "../Helpers"

describe('Test FlagMemberService ', ()=> {

    it('Should return that the member Id have been flagged', async ()=> {

        let flagMemberServiceSpec = getFlagMemberService()

        // Assign member hash id
        let memberHashId = '603cad2eee317a627064c6c73a4c8ad5e74f653d5d8ba326eac44df5a5170a41' // member id 117

        // Get the member with id
        let memberResult = await flagMemberServiceSpec.execute(memberHashId)

        let members = await getLocalDatabaseContent(db.members)
        await removeAllDatabaseDocs(db.members)

        // Asserts
        expect(members).to.be.an('array')
        expect(members[0]._memberId).to.equals(117)
        expect(memberResult).to.equal(true)
    })
})
