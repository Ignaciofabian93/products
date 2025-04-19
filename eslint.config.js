import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: globals.node,
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    rules: {
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true, allowConciseArrowFunctionExpressionsStartingWithVoid: true },
      ],
      "prefer-const": "error", // Use const when possible
      "no-var": "error", // Ban `var`
      eqeqeq: ["error", "always"], // Enforce ===
      "@typescript-eslint/consistent-type-imports": "warn",
      // Camel case for variables and properties
      camelcase: ["error", { properties: "always" }],

      // Enforce double quotes
      quotes: ["error", "double", { avoidEscape: true }],

      // Prettier rules synced here
      "prettier/prettier": [
        "error",
        {
          printWidth: 120,
          tabWidth: 2,
          singleQuote: false,
          trailingComma: "all",
          arrowParens: "always",
          endOfLine: "auto",
        },
      ],
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  tseslint.configs.recommended,
]);
