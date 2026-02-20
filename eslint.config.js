const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");

module.exports = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        files: ["**/*.ts"],
        languageOptions: {
        parserOptions: {
            project: "./tsconfig.json",
        },
        },
        rules: {
        // Your custom rules
        "no-console": "warn",
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/optional-chain-expressions" :"off"
        },
        ignores:["node_modules","dist","build"]
    },
];