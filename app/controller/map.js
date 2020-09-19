'use strict';

const Controller = require('egg').Controller;

class MapController extends Controller {
  // 查询mvt
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

  // 查询geojson
  async queryGeojson(){
    const { ctx } = this;
    const query = ctx.query;
    const result = await ctx.service.map.queryGeojson(query);
    if (result.code == 0) { ctx.body = result;ctx.status=404; return; }
    // ctx.set('Content-Type', 'application/x-protobuf');
    // ctx.set('Content-Encoding', 'gzip');
    ctx.body = result.data;
  }

  // 从sqlite中读取瓦片数据
  async queryMbtiles(){
    const { ctx } = this;
    const query = ctx.query;
    const { z, x, y } = ctx.params;
    const result = await ctx.service.map.queryMbtiles(z,x,y,query);
    if (result.code == 0) { ctx.body = result;ctx.status=404; return; }
    const tiletype = require('@mapbox/tiletype');
    // ctx.set('Content-Type', 'application/x-protobuf');
    ctx.set(tiletype.headers(result.data));
    ctx.set('Expires', new Date(Date.now() + 604800000).toUTCString());
    // ctx.set('Content-Encoding', 'gzip');
    ctx.body = result.data;
  }
}

module.exports = MapController;
