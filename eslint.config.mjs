import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import stylisticTs from "@stylistic/eslint-plugin"

import importOrderPlugin from "./eslint-custom-plugins/import-order.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "drizzle/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [ "**/*.{ts,tsx,js,jsx,mjs}" ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "import-order": importOrderPlugin,
      "@stylistic/ts": stylisticTs,
    },
    rules: {
      quotes: [ "error", "double", { avoidEscape: true, allowTemplateLiterals: true } ],
      "jsx-quotes": [ "error", "prefer-double" ],
      semi: [ "error", "never" ],
      "eol-last": [ "error", "always" ],
      "no-multiple-empty-lines": [ "error", { max: 1, maxBOF: 0, maxEOF: 1 } ],
      "no-mixed-spaces-and-tabs": "error",
      "no-tabs": "error",
      indent: [ "error", 2, { SwitchCase: 1 } ],
      "react/jsx-indent": [ "error", 2 ],
      "react/jsx-indent-props": [ "error", 2 ],
      "object-curly-spacing": [ "error", "always" ],
      "array-bracket-spacing": [ "error", "always" ],
      "space-infix-ops": [ "error" ],
      "arrow-spacing": [ "error", { before: true, after: true } ],
      "padded-blocks": [ "error", { blocks: "never", classes: "never", switches: "never" } ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "never", prev: "block-like", next: "*" },
        { blankLine: "never", prev: "function", next: "*" },
        { blankLine: "never", prev: "class", next: "*" },
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "comma-spacing": [ "error", { before: false, after: true } ],
      "import-order/ordered-import-groups": [
        "error",
        {
          groups: [
            { unmatched: true, label: "import type not matched" },
            { test: "^(?![./]|@/)" },
            { test: "^@/" },
            { test: "^(?:\\.\\./){2,}" },
            { test: "^\\.\\./" },
            { test: "^\\./" },
            { test: "(\\.module\\.)?(css|scss|sass|less)(\\?.*)?$" },
          ],
          blankLinesBetweenGroups: 1,
        },
      ],
      "@stylistic/ts/type-annotation-spacing": [
        "error",
        { before: false, after: true },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: [ "eslint-custom-plugins/*.mjs" ],
    rules: {
      "no-useless-escape": "off",
    },
  },
]

export default config
