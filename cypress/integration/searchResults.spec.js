describe("SearchResults", () => {
  it("search should keep history", () => {
    cy.visit("/#/")
      // search a package / assert it has results and that the url has changed
      .getByTestId("search-input")
      .clear()
      .type("react{enter}")
      .url()
      .should("contain", "/#/search?q=react")
      .getByTestId("search-result-item-react")
      .should("exist")
      // search a package / assert it has results and that the url has changed
      .getByTestId("search-input")
      .clear()
      .type("redux{enter}")
      .url()
      .should("contain", "/#/search?q=redux")
      .getByTestId("search-result-item-redux")
      .should("exist")
      // search a package / assert it has results and that the url has changed
      .getByTestId("search-input")
      .clear()
      .type("lodash{enter}")
      .url()
      .should("contain", "/#/search?q=lodash")
      .getByTestId("search-result-item-lodash")
      .should("exist")
      // go back / assert url changes + results and input search are in sync
      .go("back")
      .getByTestId("search-input")
      .should("have.value", "redux")
      .url()
      .should("contain", "/#/search?q=redux")
      // go back / assert url changes + results and input search are in sync
      .go("back")
      .getByTestId("search-input")
      .should("have.value", "react")
      .url()
      .should("contain", "/#/search?q=react");
  });
  it("search keywords and navigate history", () => {
    cy.visit("/#/")
      // search package click on some keyword
      .getByTestId("search-input")
      .clear()
      .type("react{enter}")
      // clicks on the first "react" keyword - assert input / url / result are in sync
      .getByTestId("keyword-react")
      .click()
      .getByTestId("search-result-item-react")
      .should("exist")
      .getByTestId("search-input")
      .should("have.value", 'keywords:"react"')
      .url()
      .then(url => {
        expect(decodeURIComponent(url)).to.include(
          '/#/search?q=keywords:"react"'
        );
      })
      // then try another keyword (the first "redux" one) - assert input / url / result are in sync
      .getByTestId("keyword-redux")
      // .should("be.visible")
      .click()
      .getByTestId("search-result-item-redux")
      .should("exist")
      .getByTestId("search-input")
      .should("have.value", 'keywords:"redux"')
      .url()
      .then(url => {
        expect(decodeURIComponent(url)).to.include(
          '/#/search?q=keywords:"redux"'
        );
      })
      // go back / assert assert input / url / result are in sync
      .go("back")
      .wait(0) // history.go('back') on front router -> cypress timeout is messed up (doesn't wait for next items to be ready)
      .getByTestId("search-input")
      .should("have.value", 'keywords:"react"')
      .getByTestId("search-result-item-react-redux")
      .should("exist")
      .url()
      .then(url => {
        expect(decodeURIComponent(url)).to.include(
          '/#/search?q=keywords:"react"'
        );
      });
  });
});
