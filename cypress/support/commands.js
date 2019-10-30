// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password)=> {
    return cy.request({
        method: 'post',
        url: Cypress.env('API_BASE_URL') + '/auth/login',
        headers: {
            'accept': 'application/json'
        },
        body: {
            email: email
        },
        response: []
    }).then(()=> {
        return cy.request({
            method: 'post',
            url: Cypress.env('API_BASE_URL') + '/auth/validate-password',
            headers: {
                'accept': 'application/json'
            },
            body: {
                password: password
            },
            response: []
        })
    }).then((response)=> {
        return response.body.token
    })
})
