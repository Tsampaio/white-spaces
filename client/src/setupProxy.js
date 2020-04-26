const { createProxyMiddleware }  = require('http-proxy-middleware');
console.log("run");
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5004',
      changeOrigin: true,
    })
  );
};