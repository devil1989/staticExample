module.exports = {
  plugins: [
    require('autoprefixer')({
        overrideBrowserslist:[//浏览器的兼容支持
            'ie>=8',
            "iOS >= 7",
            "Firefox >= 20",
            "Android > 4.4"
        ]
        // browsers: ['ie>=8','>1% in CN']
    })
  ]
};