const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    overwrite: true,
    charts: true,
    reportPageTitle: 'Login-Report',
    embeddedScreenshots: true,
    saveAllAttempts: false,
  },
  projectId: "txzn9f",
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);      
      screenshotOnRunFailure= true;
    },
    baseUrl: "https://bajratechnologies.com",
  },  
});

