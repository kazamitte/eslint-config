import prettierConfig from 'eslint-config-prettier';
import playwrightPlugin from 'eslint-plugin-playwright';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import zodPlugin from 'eslint-plugin-zod';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { createBaseConfig } from './eslint.base.js';

export const reactConfig = (tsconfigRootDir, options) => {
  const baseConfig = createBaseConfig(tsconfigRootDir, options);

  const reactConfig = [
    {
      files: ['**/*.{ts,tsx}'],
      plugins: {
        'react-hooks': hooksPlugin,
        'react-refresh': reactRefresh,
      },
      languageOptions: {
        globals: {
          ...globals.browser,
        },
      },
      settings: {
        react: { version: 'detect' },
      },
      rules: {
        ...hooksPlugin.configs.recommended.rules,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
    // JSX files: `{value && <El/>}` on optional strings is idiomatic React,
    // not worth the Boolean() ceremony strict-boolean-expressions otherwise demands.
    {
      files: ['**/*.tsx'],
      rules: {
        '@typescript-eslint/strict-boolean-expressions': [
          'warn',
          {
            allowString: true,
            allowNumber: false,
            allowNullableObject: true,
            allowNullableBoolean: false,
            allowNullableString: true,
            allowNullableNumber: false,
            allowAny: false,
          },
        ],
      },
    },
    {
      files: ['**/*.stories.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
    {
      files: ['e2e/**/*.{ts,tsx}'],
      plugins: { playwright: playwrightPlugin },
      rules: {
        ...playwrightPlugin.configs['flat/recommended'].rules,
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
    zodPlugin.configs.recommended,
    prettierConfig,
  ];

  return defineConfig([...baseConfig, ...reactConfig]);
};
