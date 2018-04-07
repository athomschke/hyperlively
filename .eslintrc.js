module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": false
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "flowtype",
        "import",
    ],
    "rules": {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    	"indent": [2, "tab"],
    	"no-tabs": 0,
      "react/jsx-indent-props": [2, 'tab'],
      "react/jsx-indent": [2, 'tab'],
      'import/no-extraneous-dependencies': ['error', {
          'devDependencies': true
      }],
      'import/prefer-default-export': 0,
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }],
      'no-bitwise': 0,
    },
    "globals": {
        "expect": true,
        "beforeEach": true,
        "afterEach": true,
        "it": true,
        "describe": true,
        "mocha": true,
        "__dirname": true,
        "SyntheticTouchEvent": true,
        "SyntheticMouseEvent": true
    },
    "env": {
        "browser": true
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": "webpack.config.js"
            },
        },
    },
};
