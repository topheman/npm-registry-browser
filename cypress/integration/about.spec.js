describe("About", () => {
  it("direct load of /about page should show About", () => {
    cy.visit("/#/about");
    cy.url().should("contain", "/about");
    cy.getByText("About").should("be.visible");
  });
  it("back Home link should work from About page", () => {
    cy.visit("/#/about");
    cy.getByTestId("link-back-home").click();
    cy.hash().should("equal", "#/");
  });
  it("should load /about page from MainDrawer", () => {
    cy.visit("/#/");
    cy
      .get("[aria-label=Menu]")
      .click()
      .getByTestId("link-to-about")
      .click();
    cy.url().should("contain", "/about");
  });
});
