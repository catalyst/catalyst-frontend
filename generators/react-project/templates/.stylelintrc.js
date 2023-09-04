module.exports = {
  'extends': [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines'
  ],
  'plugins': [
    "stylelint-order"
  ]
  'defaultSeverity': 'warning',
  'rules': {
    'import-notation': 'string',
    'font-family-no-missing-generic-family-keyword': null,
    'max-nesting-depth': [3, {
      'ignore': ['blockless-at-rules', 'pseudo-classes'],
      'ignoreAtRules': ['media']
    }],
    "order/properties-order": [
      "position"
    ],
    'no-descending-specificity': null,
    'selector-max-compound-selectors': [4],
    'selector-max-id': [1],
    'selector-no-qualifying-type': null
  }
}

