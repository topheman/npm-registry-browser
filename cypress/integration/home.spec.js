describe("Home page", () => {
  it("should load Home page", () => {
    cy.visit("/#/");
    cy.contains("npm-registry-browser").should("have.prop", "title", "Home");
  });
});
