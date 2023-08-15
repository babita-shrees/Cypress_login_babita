Cypress.Commands.add('load',() => {
    cy.visit("/web/login");
})

Cypress.Commands.add('login',(email,password)=>{
    cy.get('#login').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();  
})

Cypress.Commands.add('blankLogin',(ele,credential)=>{  
    cy.get(`#${ele}`).type(credential);    
    cy.get('button[type="submit"]').click();  
})