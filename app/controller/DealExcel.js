'use strict';

const Controller = require('egg').Controller;

class DealExcelController extends Controller {
  async uploadExcel() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    let type=ctx.query.type;
    if(!type)type=1;
    const res = await ctx.service.dealExcel.uploadExcel(stream,type);
    ctx.attachment(`定位对比.xlsx`);
    ctx.body = res.data;
  }
}

module.exports = DealExcelController;
