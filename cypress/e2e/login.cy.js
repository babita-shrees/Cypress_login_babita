let reset;
let dashboard;
let invalidEmail;
let invalidPassword;
let borderColor;
let fieldShadow;
let validationErrorMessage;
let alertMessage;
let accountLockMessage;
const email = Cypress.env("email");
const password = Cypress.env("password");

describe("Login", () => {
  before(() => {
    cy.fixture("login.json").then((data) => {
      reset = data.reset;
      dashboard = data.dashboard;
      invalidEmail = data.invalidEmail;
      invalidPassword = data.invalidPassword;
      borderColor = data.borderColor;
      fieldShadow = data.fieldShadow;
      validationErrorMessage = data.validationMessage;
      alertMessage = data.alertMessage;
      accountLockMessage = data.accountLockMessage;
    });
  });

  beforeEach(() => {
    cy.load();
  });

  //test case 01
  it("input field should be highlighted when selected", () => {
    cy.get("#login").click();
    cy.get("#login")
      .should("have.css", "border-color", borderColor)
      .and("have.css", "box-shadow", fieldShadow);

    cy.get("#password").click();
    cy.get("#password")
      .should("have.css", "border-color", borderColor)
      .and("have.css", "box-shadow", fieldShadow);
  });

  //test case 2
  it("[ Email ] field should have 'email' as placeholder and [ Password ] field should have 'password' as placeholder.", () => {
    cy.get("#login").should("have.attr", "placeholder", "Email");
    cy.get("#password").should("have.attr", "placeholder", "Password");
  });

  // test case 3
  it("user should be directed to reset password page when reset password is clicked", () => {
    cy.get('a[href="/web/reset_password"]').click();
    cy.url().should("include", reset);
  });

  //test case 4
  it("The password should be masked", () => {
    cy.get("#password").should("have.attr", "type", "password");
  });

  //test case 5
  it("User should not be able to log in when both or one of the fields is left empty", () => {
    cy.blankLogin("login", email);
    cy.get("#password").then(($input) => {
      expect($input[0].validationMessage).to.eq(validationErrorMessage);
    });

    cy.load();
    cy.blankLogin("password", password);
    cy.get("#login").then(($input) => {
      expect($input[0].validationMessage).to.eq(validationErrorMessage);
    });

    cy.load();
    cy.get('button[type="submit"]').click();
    cy.get("#login").then(($input) => {
      expect($input[0].validationMessage).to.eq(validationErrorMessage);
    });
  });

  //test case 6
  it("User should not be able to login with invalid credentials", () => {
    cy.login(invalidEmail, invalidPassword);
    cy.contains("p.alert.alert-danger", alertMessage, {
      timeout: 3000,
    }).should("be.visible");
  });

  //test case 7
  it("user can attempt only 3 unsuccessful logins", () => {
    // Perform 3 unsuccessful login attempts
    for (let i = 0; i < 3; i++) {
      cy.login(invalidEmail, invalidPassword);
      cy.contains("p.alert.alert-danger", alertMessage, {
        timeout: 3000,
      }).should("be.visible");
    }

    // Attempt the 4th login with invalid credentials
    cy.login(invalidEmail, invalidPassword);
    cy.contains(accountLockMessage);
  });

  //test case 8
  it("User should be able to login with valid credentials and with enter key", () => {
    cy.get("#login").type(email);
    cy.get("#password").type(password + "{enter}");
    cy.url().should("include", dashboard);
  });

    //test case 9
  it("intercept example", () => {
    cy.intercept("POST", "/check/location", (req) => {
      req.reply((res) => {
        if (res.statusCode == 200) {
          res.body.result.url =
            "/web#model=bajra_scrum.task&view_type=kanban&cids=&menu_id=317";
        }
      });
    }).as("login");

    cy.login(email, password);

    cy.wait("@login");
    cy.url().should(
      "include",
      "/web#model=bajra_scrum.task&view_type=kanban&cids=&menu_id=317"
    );
  });
});
