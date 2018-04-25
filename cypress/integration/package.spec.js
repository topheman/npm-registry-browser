const VISIT_URL = "/#/package/react@16.3.0";

describe("Package", () => {
  before(() => {
    cy.clearSWCache();
  });
  it("should access specific version from url", () => {
    cy.visit(VISIT_URL); // direct visit
    cy.getByText("react@16.3.0").should("be.visible");
  });
  it("button should show version then become interactive", () => {
    cy.visit("/#/"); // preload
    cy.visit(VISIT_URL); // direct visit
    cy
      .get("button[data-testid=button-version-choice]:disabled") // the button should be disabled
      .getByText("react@16.3.0");
    cy
      .get("button[data-testid=button-version-choice]")
      .should("not.be.disabled"); // then become interactive
  });
  it("should follow dependencies", () => {
    let matchedDependency;
    cy.visit(VISIT_URL); // direct visit
    cy
      .getByTestId("dependencies-tab")
      .getByText("Dependencies (")
      .click(); // open tab
    cy
      .getByTestId("dependencies-tab")
      .find("a:first")
      .then(el => {
        matchedDependency = Cypress.$(el).text();
        return el;
      })
      .click() // click on first dependency
      .then(() => cy.url().should("contain", `/package/${matchedDependency}@`));
  });
  it("should follow versions", () => {
    cy.visit(VISIT_URL); // direct visit
    cy
      .getByTestId("versions-tab")
      .getByText("Versions (")
      .click(); // open tab
    cy
      .getByTestId("versions-tab")
      .getByText("15.4.2")
      .click();
    cy.url().should("contain", `/package/react@15.4.2`);
  });
  it("should open package.json tab", () => {
    cy.visit(VISIT_URL); // direct visit
    cy
      .getByTestId("packageJson-tab")
      .getByText("package.json (")
      .click() // open tab
      .get("[data-testid=packageJson-tab] pre")
      .should("be.visible");
  });
  it("should follow keywords", () => {
    let matchedKeyword;
    cy.visit(VISIT_URL); // direct visit
    cy
      .getByTestId("keywords-list")
      .find("a:first")
      .then(el => {
        matchedKeyword = Cypress.$(el).text();
        console.log({ matchedKeyword });
        return el;
      })
      .click() // click on first keyword
      .then(() =>
        cy.url().should(url => {
          expect(decodeURIComponent(url)).to.include(
            `/search?q=keywords:"${matchedKeyword}"`
          );
        })
      );
  });
  ["DESKTOP", "MOBILE"].forEach(platform => {
    it(`[${platform}] should access version from title ${
      platform === "MOBILE" ? "drawer" : "popup"
    }`, () => {
      if (platform === "MOBILE") {
        cy.viewport("iphone-6");
      }
      cy.visit(VISIT_URL); // direct visit
      cy
        .get("button[data-testid=button-version-choice]") // open list
        .click()
        .get(
          '[data-testid=list-version-choice] [href="#/package/react@15.4.2"]:first'
        ) // click on specific version
        .click()
        .should("not.exist") // make sure it disappeared
        .url()
        .should("contain", "/package/react@15.4.2");
    });
  });
});
