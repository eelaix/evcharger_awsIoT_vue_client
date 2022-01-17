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
    users: {
      entry: 'src/users.js',
      template: 'public/users.html',
      filename: 'users.html',
      title: 'users',
      chunks: ['chunk-vendors', 'chunk-common', 'users']
    },
    index: 'src/charger.js'
  }
}