describe("Home", () => {
  before(() => {
    cy.clearSWCache();
    cy.visit("/#/");
  });
  it("should load Home page", () => {
    cy.contains("npm-registry-browser").should("have.prop", "title", "Home");
  });
});
