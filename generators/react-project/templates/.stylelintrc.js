module.exports = {
  'extends': [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines'
  ],
  'defaultSeverity': 'warning',
  'rules': {
    'font-family-no-missing-generic-family-keyword': null,
    'max-nesting-depth': [3, {
      'ignore': ['blockless-at-rules', 'pseudo-classes'],
      'ignoreAtRules': ['media']
    }],
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': null,
    'selector-max-compound-selectors': [4],
    'selector-max-id': [1],
    'selector-no-qualifying-type': null
  }
}

