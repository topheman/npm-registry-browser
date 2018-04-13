describe("Search", () => {
  before(() => {
    cy.clearSWCache();
    cy.visit("/#/");
  });
  describe("Search/Input", () => {
    it("should fire autocompletion when typing", () => {
      cy.get("[data-testid='search-input']").type("react");
      cy
        .get("[data-testid='search-loading-indicator']")
        .should("not.contain", "error");
      // wait for the results (and make sure it's correct)
      cy.get("[data-testid='search-result-0']").contains("react");
      cy.get("[data-testid='search-input']").type("{downarrow}{enter}");
      // make sure we were redirected
      cy.url().should("contain", "/#/package/react@");
    });
  });
});
