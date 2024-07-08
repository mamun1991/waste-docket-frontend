const nextTranslate = require('next-translate');
const removeImports = require('next-remove-imports')();

module.exports = removeImports(
  nextTranslate({
    poweredByHeader: false,
    trailingSlash: true,
    basePath: '',
    reactStrictMode: true,
    images: {
      domains: ['localhost'],
      remotePatterns: [],
      minimumCacheTTL: 1500000,
    },
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'es', 'pt', 'it', 'ro'],
    },
  })
);
