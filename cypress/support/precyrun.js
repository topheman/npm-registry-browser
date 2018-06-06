// This file is called on "precy:run" script
console.log(`
= Running all test files in the same spec ==========================================================

Since cypress@3.x.x, each spec file runs in isolation. The tests took much longer to run.

To speed them up, I decided to run all the files in the same spec.

When creating a new spec file, update cypress/integration/index.spec.js, add your file.

If you want to revert to the regular usage:
- remove cypress/integration/index.spec.js
- update cypress.json, remove the "testFiles" entry.

────────────────────────────────────────────────────────────────────────────────────────────────────
`);
