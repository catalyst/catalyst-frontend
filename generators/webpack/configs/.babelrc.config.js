module.exports = function render(contents, filename, options) {
  const json = {
    "presets": [],
    "plugins": [
      "@babel/plugin-proposal-object-rest-spread",
    ]
  };

  if (options.typescript) {
    json.presets.push("@babel/typescript");
  } else {
    json.presets.push(["@babel/preset-env", {
      "forceAllTransforms": true,
      "modules": false
    }]);
  }

  if (options.react) {
    json.presets.push("@babel/preset-react");
    json.plugins.push("react-hot-loader/babel")
  }

  if (options.jest) {
    json.env = {
      "test": {
        "plugins": ["@babel/plugin-transform-modules-commonjs"]
      }
    }
  }

  return JSON.stringify(json, null, 2);
}
