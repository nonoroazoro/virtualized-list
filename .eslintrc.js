const { isProd } = require("./scripts/build.config");

const config = {
    "extends": [
        "eslint-config-zoro/eslint",
        "eslint-config-zoro/typescript"
    ],
    "env": {
        "jest": true
    },
    "parserOptions": {
        "project": "./tsconfig.eslint.json"
    }
};

if (!isProd)
{
    config.rules = {
        "no-console": "off",
        "@typescript-eslint/no-unused-vars": "off"
    };
}

module.exports = config;
