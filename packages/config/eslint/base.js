import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

// Architectural boundary: nothing may import an app. Shared code goes in packages/*.
export const noAppImports = {
  patterns: [
    {
      group: ['@repo/web', '@repo/web/*', '@repo/server', '@repo/server/*'],
      message: 'Apps must never be imported. Promote shared code into packages/*.',
    },
    {
      group: ['**/apps/**'],
      message: 'Do not import app code by relative path. Shared code belongs in packages/*.',
    },
  ],
};

export default tseslint.config(
  { ignores: ['**/dist/**', '**/.next/**', '**/.turbo/**', '**/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-imports': ['error', noAppImports],
    },
  },
  prettier,
);
