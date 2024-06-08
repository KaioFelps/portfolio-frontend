import eslintJS from "@eslint/js"
import eslintTS from "typescript-eslint"
import eslintSvelte from 'eslint-plugin-svelte';
import prettier from "eslint-config-prettier"
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    eslintJS.configs.recommended,
    ...eslintTS.configs.recommended,
    ...eslintSvelte.configs['flat/recommended'],
    prettier,
    ...eslintSvelte.configs['flat/prettier'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: eslintTS.parser,
                extraFileExtensions: [".svelte"],
                ecmaFeatures: {
                    spread: true
                },
                ecmaVersion: "latest",
                sourceType: "module",
            }
        },
        settings: {
            svelte: {
                ignoreWarnings: [
                    '@typescript-eslint/no-unsafe-assignment',
                    '@typescript-eslint/no-unsafe-member-access'
                ],
            }
        },
        ignores: ["build/", ".svelte-kit/**/*", "dist/"],
        rules: {
            "svelte/html-closing-bracket-spacing": "warn",
            "svelte/indent": "off",
            "svelte/html-quotes": "warn",
            "svelte/max-attributes-per-line": "off",
            "svelte/html-self-closing": "warn",
            "svelte/no-trailing-spaces": "error",
            "svelte/no-useless-mustaches": "error",
            "svelte/valid-each-key": "error",
            "svelte/mustache-spacing": ["warn", {
                "textExpressions": "never",
                "attributesAndProps": "never",
                "directiveExpressions": "never",
                "tags": {
                  "openingBrace": "never",
                  "closingBrace": "never"
                }
            }],
        }
    },
    { ignores: [".svelte-kit/**/*"] }
];
