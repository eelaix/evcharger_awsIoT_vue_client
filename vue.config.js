module.exports = {
  pages: {
    charger: {
      entry: 'src/charger.js',
      template: 'public/charger.html',
      filename: 'charger.html',
      title: 'charger',
      chunks: ['chunk-vendors', 'chunk-common', 'charger']
    },
    devices: {
      entry: 'src/devices.js',
      template: 'public/devices.html',
      filename: 'devices.html',
      title: 'devices',
      chunks: ['chunk-vendors', 'chunk-common', 'devices']
    },
    index: 'src/charger.js'
  }
}