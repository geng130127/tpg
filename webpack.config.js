function resolve(dir) {
  return path.join(__dirname, dir)
};

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@components':resolve('src/components'),
      '@common':resolve('src/common'),
      '@assets':resolve('src/assets'),
      '@store':resolve('src/store')
    }
  }
};
