describe("Qrcode", () => {
  it("direct load of /qrcode page should show Qrcode ", () => {
    cy.visit("/#/qrcode");
    cy.url().should("contain", "/qrcode");
    cy.getByTestId("qrcode-standalone").should("be.visible");
  });
  it("back Home link should work from QrCode page", () => {
    cy.visit("/#/qrcode");
    cy.getByTestId("link-back-home").click();
    cy.hash().should("equal", "#/");
  });
  it("should load /qrcode page from MainDrawer", () => {
    cy.visit("/#/");
    cy.get("[aria-label=Menu]")
      .click()
      .getByTestId("link-to-qrcode")
      .click();
    cy.url().should("contain", "/qrcode");
    cy.getByTestId("qrcode-standalone").should("be.visible");
  });
});
