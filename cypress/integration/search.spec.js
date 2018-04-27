describe("Search", () => {
  before(() => {
    // make sure to clear the SW cache before starting the following tests
    cy.prepareTestSuite();
  });
  it("autocomplete should display results, be usable with keyboard", () => {
    cy.visit("/#/");
    cy
      .getByTestId("search-input")
      .type("react")
      .getByTestId("search-loading-indicator")
      .should("not.contain", "error")
      // wait for the results (and make sure it's correct)
      .getByTestId("search-result-react")
      .contains("react")
      .getByTestId("search-input")
      .type("{downarrow}{enter}")
      // make sure we were redirected
      .url()
      .should("contain", "/#/package/react@");
  });
  ["DESKTOP", "MOBILE"].forEach(platform => {
    it(`[${platform}] autocomplete should display results, be usable with mouse`, () => {
      if (platform === "MOBILE") {
        cy.viewport("iphone-6");
      }
      cy.visit("/#/");
      cy
        .getByTestId("search-input")
        .click()
        .wait(0) // on mobile, the backdrop will be over, wait next tick
        .getByTestId("search-input")
        .type("redux", platform === "MOBILE" ? { force: true } : {}) // force: true necessary for `cypress run` ...
        .should("have.value", "redux")
        .getByTestId("search-loading-indicator")
        .should("not.contain", "error")
        // wait for the results (and make sure it's correct)
        .getByTestId("search-result-redux")
        .contains("redux")
        .click()
        // make sure we were redirected
        .url()
        .should("contain", "/#/package/redux@");
    });
    it(`[${platform}] search box should redirect to search results when hit enter`, () => {
      if (platform === "MOBILE") {
        cy.viewport("iphone-6");
      }
      cy.visit("/#/");
      cy
        .getByTestId("search-input")
        .click()
        .wait(0) // on mobile, the backdrop will be over, wait next tick
        .getByTestId("search-input")
        .type("react{enter}", platform === "MOBILE" ? { force: true } : {}) // force: true necessary for `cypress run` ...
        .url()
        .should("contain", "/#/search?q=react")
        .getByTestId("search-input")
        .should("have.value", "react");
    });
  });
});
