module.exports = function (api) {
  api.cache.using(() => process.env.NOD_ENV === 'development');
  const isDev = api.env('development');
  return {
    presets: ['@babel/preset-env', ['@babel/preset-react']],
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      ['@babel/plugin-transform-classes', { loose: true }],
    ],
    env: {
      development: {
        plugins: ['react-refresh/babel'],
      },
    },
  };
};
