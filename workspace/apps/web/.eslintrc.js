/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ["@repo/eslint-config/next.js"],
    parser: "@typescript-eslint/parser",
    ignorePatterns: ["out/"],
    parserOptions: {
        project: true,
    },
};
