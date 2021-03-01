const { createProxyMiddleware }  = require('http-proxy-middleware');
console.log("run");
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5004',
      changeOrigin: true,
    })
  );
};