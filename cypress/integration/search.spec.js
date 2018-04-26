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
  it("autocomplete should display results, be usable with mouse", () => {
    cy.visit("/#/");
    cy
      .getByTestId("search-input")
      .type("redux")
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
  it("search box should redirect to search results when hit enter", () => {
    cy.visit("/#/");
    cy
      .getByTestId("search-input")
      .type("react{enter}")
      .url()
      .should("contain", "/#/search?q=react");
  });
});
