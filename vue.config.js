const path = require("path");
const marked = require("marked");
const renderer = new marked.Renderer();

module.exports = {
  devServer: {
    proxy: 'http://localhost:3000'
  },
  configureWebpack: {
    module: {
      rules: [{
        test: /\.md$/,
        use: [
          {
            loader: "html-loader"
          },
          {
            loader: "markdown-loader",
            options: {
              pedantic: true,
              renderer
            }
          }
        ]
      }]
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "src/assets/common.less")]
    }
  }
}
