// const jwt = require('jsonwebtoken');
'use strict';
const jwt = require('jsonwebtoken');
module.exports = options => {
  return async function auth(ctx, next) {
    console.log('yangzh中间件');
    const access_token = ctx.request.headers['x-access-token'] || ctx.request.query.access_token;
    if (!access_token) {
      ctx.status = 401;
      ctx.body = {
        code: 0,
        data: null,
        msg: '无access_token',
      };
      return;
    }
    const decode = jwt.decode(access_token);
    if (!decode) {
      ctx.status = 401;
      ctx.body = {
        code: 0,
        data: null,
        msg: 'access_token不符合标准。',
      };
      return;
    }
    console.log('decode', decode);
    try {
      jwt.verify(access_token, 'my-token'); // 验证失败会抛异常
    } catch (err) {
      ctx.status = 401;
      ctx.body = { code: 0, data: null, msg: 'access验证失败' };
      return;
    }
    await next();
  };
};

