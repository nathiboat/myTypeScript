// Fetch the master email and master password from the env file

describe('Make a POST request to /auth/login with master email', ()=> {
    it('Should return the status 200 and body "true"', ()=> {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/auth/login',
            headers: {
                'accept': 'application/json'
            },
            body: {
                email: Cypress.env('MASTER_EMAIL')
            },
            response: []
        }).then((response)=> {
            assert.equal(response.status, 200)
            assert.equal(response.body, true)
        })
    })
})

describe('Make a POST request to /auth/validate-password with master password', ()=> {
    it('Should return the master staff', ()=> {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/auth/validate-password',
            headers: {
                'accept': 'application/json'
            },
            body: {
                password: Cypress.env('MASTER_PASSWORD')
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.equal(response.body.email, Cypress.env('MASTER_EMAIL'))
            assert.equal(response.body.password, undefined)
            expect(response.body.token).to.have.length(176)
        })
    })
})
