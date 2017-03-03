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
        "react/jsx-indent": [2, 'tab']
    },
    "env": {
        "browser": true
    },
};