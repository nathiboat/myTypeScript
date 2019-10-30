describe('Test the shortcut end routes', () => {
    it('Should make a GET request to /shortcut/all and return all shortcuts that have not been deleted', () => {
        cy.request({
            method: 'get',
            url: Cypress.env('API_BASE_URL') + '/shortcut/all',
            headers: {
                'accept': 'application/json'
            }
        }).then((response)=> {
            assert.equal(response.status, 200)
            assert.isArray(response.body)
            if(response.body.length > 0) {
                expect(response.body[0]).to.have.keys(['id', 'timeStamp', 'name', 'keys', 'content', 'deleted'])
                expect(response.body[0].deleted).to.equal(0)
            }
        })

    })

    it('Should make a GET request to /shortcut/deleted and return the shortcuts that have been deleted', () => {
        cy.request({
            method: 'get',
            url: Cypress.env('API_BASE_URL') + '/shortcut/deleted',
            headers: {
                'accept': 'application/json'
            }
        }).then((response) => {
            assert.equal(response.status, 200)
            assert.isArray(response.body)
            if(response.body.length > 0) {
                expect(response.body[0]).to.have.keys(['id', 'timeStamp', 'name', 'keys', 'content', 'deleted'])
                expect(response.body[0].deleted).to.equal(1)
            }
        })
    })

    it('Should make a POST request to /shortcut and insert a new shortcut into the database', () => {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/shortcut/create',
            headers: {
                'accept': 'application/json'
            },
            body: {
                'name': 'brb',
                'keys': 'brb',
                'content': 'Be right back!'
            }
        }).then((response) => {
            assert.equal(response.status, 200)
        })
    })

    it('Should make a POST request to /shortcut/update and update a shortcut in the database', () => {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/shortcut/update/1',
            headers: {
                'accept': 'application/json'
            },
            body: {
                'name': 'brb',
                'keys': 'brb',
                'content': 'Be right back!',
                'id': 1
            }
        }).then((response) => {
            assert.equal(response.status, 200)
        })
    })

    it('Should make a POST request to /delete and soft delete a shortcut with the given id', () => {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/shortcut/delete/1',
            headers: {
                'accept': 'application/json'
            }
        }).then((response) => {
            assert.equal(response.status, 200)
        })
    })

    it('Should make a POST request to /restore and restore a deleted shortcut with the given id', () => {
        cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/shortcut/restore/1',
            headers: {
                'accept': 'application/json'
            }
        }).then((response) => {
            assert.equal(response.status, 200)
        })
    })
})