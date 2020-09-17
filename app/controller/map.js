'use strict';

const Controller = require('egg').Controller;

class MapController extends Controller {
  async queryMvt() {
    const { ctx } = this;
    const { z, x, y } = ctx.params;
    const query = ctx.query;
    if (z == null || x == null || y == null) { ctx.body = { code: 0, data: null, msg: '缺少必要参数' }; return; }
    const result = await ctx.service.map.queryMvt(z, x, y, query);
    if (result.code == 0) { ctx.body = result;ctx.status=404; return; }
    ctx.set('Content-Type', 'application/x-protobuf');
    ctx.set('Content-Encoding', 'gzip');
    ctx.body = result.data;
  }
 
}

module.exports = MapController;
