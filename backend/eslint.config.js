import js from "@eslint/js";

export default [
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "*.min.js",
            "*.bundle.js",
            "public/**",
        ],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            // ▼ Reglas base de ESLint =========================================================
            ...js.configs.recommended.rules,

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