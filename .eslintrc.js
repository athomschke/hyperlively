module.exports = {
    "extends": "airbnb",
    "import/resolver": "webpack",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": false
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
    	"indent": [2, "tab"],
    	"no-tabs": 0,
        "react/jsx-indent-props": [2, 'tab'],
        "react/jsx-indent": [2, 'tab'],
        'import/no-extraneous-dependencies': ['error', {
            'devDependencies': true
        }],
        'import/prefer-default-export': 0,
    },
    "globals": {
        "expect": true,
        "beforeEach": true,
        "afterEach": true,
        "it": true,
        "describe": true,
        "__dirname": true,
        "sinon": true
    },
    "env": {
        "browser": true
    },
};