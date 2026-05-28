import globals from 'globals';

import base, { noAppImports } from './base.js';

export default [
  ...base,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Extend the app-boundary rule with feature isolation: a feature may only be
      // imported through its public index, never its internals.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...noAppImports.patterns,
            {
              group: ['@/features/*/*'],
              message:
                'Import a feature only through its public index (e.g. "@/features/auth"), never its internals.',
            },
          ],
        },
      ],
    },
  },
];
