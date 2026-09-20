import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import playwrightPlugin from 'eslint-plugin-playwright';
import hooksPlugin from 'eslint-plugin-react-hooks';
import zodPlugin from 'eslint-plugin-zod';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import { createBaseConfig } from './eslint.base.js';

const APP_ROUTER_CONVENTION_FILES = [
  // Route segment UI + route handlers
  '**/app/**/{page,layout,template,default,loading,error,global-error,not-found,forbidden,unauthorized,route}.{ts,tsx}',
  // Metadata files (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  '**/app/**/{sitemap,robots,manifest}.{ts,tsx}',
  '**/app/**/{icon,apple-icon,opengraph-image,twitter-image}.{ts,tsx}',
  // Project-root conventions — outside `app/`, same `export function` shape
  '**/{middleware,instrumentation,instrumentation-client}.{ts,tsx}',
];

export const nextConfig = (tsconfigRootDir, options) => {
  const baseConfig = createBaseConfig(tsconfigRootDir, options);

  const nextConfig = [
    globalIgnores(['.next/**', 'next-env.d.ts']),
    {
      files: ['**/*.{ts,tsx}'],
      plugins: {
        'react-hooks': hooksPlugin,
        '@next/next': nextPlugin,
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
        ...nextPlugin.configs['core-web-vitals'].rules,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
    // App Router convention files use `export default function`
    {
      files: APP_ROUTER_CONVENTION_FILES,
      rules: {
        'func-style': 'off',
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

  return defineConfig([...baseConfig, ...nextConfig]);
};
