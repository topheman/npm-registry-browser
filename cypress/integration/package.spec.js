describe("Package", () => {
  before(() => {
    cy.clearSWCache();
    cy.visit("/#/package/react");
  });
  it("should load the page", () => {
    cy.get("section > section").contains("react");
  });
});
