'use strict';
const fs = require('fs');

// 自己测试，非node任务
const Controller = require('egg').Controller;

class CommonController extends Controller {
   // 通用新建更新服务
   async createOrUpdateData() {
    const { ctx, service } = this;
    let json = ctx.request.body.datajson;
    const tablename = ctx.request.body.tablename;
    json = typeof json === 'string' ? JSON.parse(json) : json;
    const { validator } = this.app;
    let result = {
      code: 1,
      data: null,
      msg: '查询成功',
    };
    const rule = {
      tablename: { type: 'tablename', required: false },
    };
    const errorArr = validator.validate(rule, ctx.request.body);
    if (errorArr) {
      result.code = 0;
      result.data = errorArr;
      result.msg = '参数类型错误';
    } else {
      if (json.id || json.ogc_fid) {
        result = await service.common.updateData(tablename, json);
      } else {
        result = await service.common.createData(tablename, json);
      }
    }
    ctx.body = result;
    return;
  }

  // 通用查询
  async queryListCommon() {
    const { ctx } = this;
    const qeury = ctx.query;
    const result = await ctx.service.common.queryListCommon(qeury);
    ctx.body = result;
    return;
  }

}

module.exports = CommonController;
