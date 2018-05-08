describe("Home", () => {
  beforeEach(() => {
    // make sure to start from a blank page for each test
    cy.visit("/#/");
  });
  it("should load Home page", () => {
    cy.contains("npm-registry-browser").should("have.prop", "title", "Home");
  });
  it("should redirect to latest version when click on chip with no version", () => {
    cy
      .getByTestId("chip-wrapper")
      .getByText(/^react$/)
      .click();
    cy.url().should("match", /\/package\/react@(\d+)\.(\d+)\.(\d+)/);
  });
  it("should redirect to specific version when click on chip with version", () => {
    cy
      .getByTestId("chip-wrapper")
      .getByText(/^react@0\.14\.0$/)
      .click();
    cy.url().should("contain", "/package/react@0.14.0");
  });
  it("[DESKTOP] should show the qrcode on regular screens", () => {
    cy.getByTestId("qrcode").should("be.visible");
  });
  it("[MOBILE] should hide the qrcode on small screens", () => {
    cy.viewport("iphone-6");
    cy.getByTestId("qrcode").should("not.be.visible");
  });
  it("should open main drawer when click hamburger menu", () => {
    cy.get("[aria-label=Close]").should("not.be.visible");
    cy.get("[aria-label=Menu]").click();
    cy
      .get("[aria-label=Close]")
      .should("be.visible")
      .click()
      .should("not.be.visible");
  });
});
