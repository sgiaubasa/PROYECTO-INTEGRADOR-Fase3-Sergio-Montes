import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
        ],
    },
    {
        files: [ "**/*.js", "**/*.jsx" ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2025,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        settings: {
            react: {
                version: "18.3.1",
            },
            "import/resolver": {
                alias: {
                    map: [
                        [ "@", "./src" ],
                    ],
                    extensions: [ ".js", ".jsx", ".json" ],
                },
            },
        },
        rules: {
            // ▼ Reglas base de ESLint =========================================================
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            // ▼ Reglas de React  ==============================================================
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": [ "warn", { allowConstantExport: true }],
            "react/jsx-max-props-per-line": [ "error", { "maximum": 1, "when": "multiline" }],
            "react/jsx-first-prop-new-line": [ "error", "multiline" ],
            "react/jsx-wrap-multilines": "off",
            "react/jsx-closing-bracket-location": [ "error", "after-props" ],
            "jsx-quotes": [ "error", "prefer-double" ],
            "react-hooks/exhaustive-deps": "off",

            // ▼ Reglas de React PropTypes (con prioridad) =====================================
            "react/prop-types": "error",
            "react/no-unused-prop-types": "error",
            "react/forbid-prop-types": "error",

            // ▼ Reglas de Formato y Sintaxis ==================================================
            "semi": [ "error", "always" ],
            "quotes": [ "error", "double" ],
            "indent": [ "error", 4, { "StaticBlock": { "body": 4 } }],
            "camelcase": [ 2, { "properties": "always" }],
            "no-multi-spaces": "error",
            "no-trailing-spaces": [ "error", { "ignoreComments": true }],
            "eol-last": [ "error", "never" ],
            "no-multiple-empty-lines": [ "error", { "max": 1, "maxEOF": 1, "maxBOF": 1 }],

            // ▼ Reglas de Espaciado y Puntuación ==============================================
            "comma-dangle": [ "error", "always-multiline" ],
            "comma-spacing": [ "error", { "before": false, "after": true }],
            "arrow-parens": [ "error", "always" ],
            "no-spaced-func": "error",

            // ▼ Reglas de Variables y Constantes ==============================================
            "prefer-const": [ "error", { "destructuring": "any", "ignoreReadBeforeAssign": false }],
            "no-unused-vars": [ "error", { "args": "after-used" }],

            // ▼ Reglas de Funciones ===========================================================
            "func-style": [ "error", "expression" ],
            "max-statements": [ "error", 25 ],

            // ▼ Reglas de Estructuras de Datos ================================================
            "array-bracket-spacing": [ "error", "always", { "singleValue": false, "arraysInArrays": true, "objectsInArrays": false }],
            "object-curly-spacing": [ "error", "always" ],

            // ▼ Reglas de Configuración y Entorno =============================================
            "global-require": "off",
            "no-process-env": "off",
            "no-undef": "off",
            "sort-keys": "off",
            "sort-vars": "off",
        },
    },
];