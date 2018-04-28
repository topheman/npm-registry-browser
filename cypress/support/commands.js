/* eslint-disable no-undef, arrow-body-style */
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

/**
 * Call this before running a test suite to make sure you have the latest
 * version of the code.
 *
 * See: https://github.com/cypress-io/cypress/issues/702
 * @return {Promise}
 */
Cypress.Commands.add("clearSWCache", () => {
  return window.caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        return window.caches.delete(cacheName);
      })
    ).then(() => {
      console.info("Service Worker cache flushed");
    });
  });
});
Cypress.Commands.add("prepareTestRun", () => {
  // set from env var CYPRESS_LAUNCH_MODE
  if (Cypress.env("LAUNCH_MODE") === "debug-build") {
    cy.log("Debug build mode");
    cy.log("⚠️ You are testing the production build");
    cy.log(
      `Reminder: Any changes to app sources won't be reflected until you re-build`
    );
    cy.log("Use npm run test:cypress:dev to develop your tests");
    cy.log("");
  }
  cy.log("🚿 clear ServiceWorker cache"); // can't put it in cy.clearSWCache() due to Promise management of Cypress ...
  cy.clearSWCache();
});
