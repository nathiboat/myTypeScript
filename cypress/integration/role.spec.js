// Get the master email and master password from env file

describe('Test the role API routes', ()=> {
    let token = null
    before(()=> {
        cy.login(Cypress.env('MASTER_EMAIL'), Cypress.env('MASTER_PASSWORD')).then((result)=> {
            token = result
        })
    })

    let insertedRoleId = null
    it('Make POST request to /role/store, should save the new Role and return the Role', ()=> {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/role/store',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            body: {
                name: 'Admin',
                description: 'Admin role',
                productName: 'Comunity'
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.isNumber(response.body.id)
            insertedRoleId = response.body.id
            // cy.removeRole(response.body.id, token)
        })
    })

    it('Make GET request to /role/collection, should return all roles in the database', ()=> {
        cy.request({
            method: 'get',
            url: Cypress.env('API_BASE_URL') + '/role/collection',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.isNumber(response.body[0].id)
            expect(response.body.length).to.be.greaterThan(1)
        })
    })

    it('Make a DELETE request to /role/remove, should return all roles in the database', ()=> {
        cy.request({
            method: 'delete',
            url: Cypress.env('API_BASE_URL') + '/role/remove',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            },
            qs: {
                roleId: insertedRoleId
            },
            response: []
        }).then((response)=> {
            cy.log(response.body)
            assert.equal(response.status, 200)
            assert.equal(response.body, null)
        })
    })
})
