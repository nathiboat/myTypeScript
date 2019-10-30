


describe('Test the member API routes', ()=> {
    let token = null
    before(()=> {
        cy.login(Cypress.env('MASTER_EMAIL'), Cypress.env('MASTER_PASSWORD')).then((result)=> {
            token = result
        })
    })

    it('Make a GET request to /member/approve/pending, should return the number of members pending to be approved', ()=> {
        cy.request({
            method: 'get',
            url: Cypress.env('API_BASE_URL') + '/member/approve/pending',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.isNumber(response.body)
        })
    })

    let memberHashId = null
    let approveQuestions = null

    it('Make a GET request to /member/approve, should return a member object with the questions required to approve it', ()=> {
        cy.request({
            method: 'get',
            url: Cypress.env('API_BASE_URL') + '/member/approve',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            expect(response.body).to.have.key(['member', 'questions'])

            memberHashId     = response.body.member
            approveQuestions = response.body.questions
        })
    })

    it('Make a POST request to /member/approve, should return TRUE', ()=> {

        let answers = approveQuestions.map((question)=> {
            return { answer: 'yes', field: question.field }
        })
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/member/approve',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            body: {
                memberHashId: memberHashId,
                answers: answers
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.equal(response.body, true)
        })
    })
})
