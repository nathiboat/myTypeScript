describe('Test the staff API routes', ()=> {
    let token = null
    before(()=> {
        cy.login(Cypress.env('MASTER_EMAIL'), Cypress.env('MASTER_PASSWORD')).then((result)=> {
            token = result
        })
    })

    let insertedStaff = null

    it('Make POST request to /staff/store, should save the new Staff and return it', ()=> {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/staff/store',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            body: {
                roles: [2],
            	firstName: 'Radu',
            	lastName: 'Darie',
            	email: 'raducu@gmail.com'
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.isNumber(response.body.id)

            insertedStaff = response.body

        })
    })

    it('Make POST request to /staff/update, should update the Staff and return it', ()=> {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/staff/update',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            body: {
                id: insertedStaff.id,
                roles: [2, 3],
            	firstName: 'Dorel',
            	lastName: 'Darie',
            	email: 'dorel@gmail.com'
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.isNumber(response.body.id)
            assert.equal(response.body.id, insertedStaff.id)

            insertedStaff = response.body
        })
    })

    it('Make GET request to /staff/collection, should return all Staffs from database', ()=> {
        cy.request({
            method: 'get',
            url: Cypress.env('API_BASE_URL') + '/staff/collection',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.isNumber(response.body[0].id)

        })
    })

    it('Make POST request to /staff/search, should return the Staff with matching token', ()=> {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/staff/search',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            body: {
                token: token
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            // assert.isNumber(response.body[0].id)

        })
    })

    it('Make DELETE request to /staff/remove, should return null', ()=> {
        cy.request({
            method: 'delete',
            url: Cypress.env('API_BASE_URL') + '/staff/remove',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            qs: {
                id: insertedStaff.id
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            // assert.isNumber(response.body[0].id)

        })
    })
})
