
const util = require('../util');
const Service = require("egg").Service;
const zlib = require('zlib');
var UUID = require('uuid');
const rd = require('rd');
const fs = require('fs');
const path = require("path");

class CommonService extends Service {
  async createData(tablename, datajson, tag) {
    const { logger, ctx } = this;
    const result = {
      code: 1,
      data: {},
      msg: '新建成功',
    };
    if(tablename.indexOf("geo_")!=-1){
      //datajson.ogc_fid = UUID.v1();   // todo 其实这个ogc_fid不确定，矢量数据导入时 主键字段 不一定为 ogc_fid，这个可以统一一下，获者写灵活
    }else{
      datajson.id = UUID.v1();
    }
    const createSqlRes = await this.service.common.createSql(tablename, datajson);
    if (createSqlRes.code == 0)return createSqlRes;
    const resCreate = await this.ctx.model.query(createSqlRes.data).catch(err => {
      result.code = 0;
      result.msg = '新建失败';
      result.data = err;
      logger.error(new Error(err));
    });
    if (resCreate && resCreate[0]) {
      result.data = resCreate[0];
    }
    // 如果有附件，新增附件
    if (datajson.fjList && datajson.fjList !== '') {
    }
    return result;
  }

  async createSql(tablename, datajson,epsg) {
    const result = {
      code: 1,
      data: '',
      msg: '',
    };
    if(!epsg)epsg='4326';
    const insertFieldArr = new Array();
    const insertValueArr = new Array();
    for (const key in datajson) {
        insertFieldArr.push(`"${key}"`);
        if (datajson[key]) {
          if(key.indexOf("geom")!=-1){ // 空间字段
            insertValueArr.push(`public.ST_SetSRID(public.st_geomfromgeojson('${JSON.stringify(datajson[key])}'),${epsg})`);
          }else{
            const type = typeof datajson[key];
            if (type === 'object') {
              insertValueArr.push("'" + JSON.stringify(datajson[key]) + "'");
            } else {
              insertValueArr.push(`'${datajson[key]}'`);
            }
          }
        } else {
          insertValueArr.push('null');
        }
    }
    const insertSql = `INSERT INTO ${tablename} (${insertFieldArr.join(',')}) VALUES (${insertValueArr.join(',')}) RETURNING *;`;
    result.data = insertSql;
    return result;
  }

  async updateData(tablename, datajson,epsg) {
    const { logger,ctx } = this;
    const result = {
      code: 1,
      data: {},
      msg: '更新成功',
    };
    if(!epsg)epsg=4326;
    const updateSqlRes = await this.service.common.updateSql(tablename, datajson,epsg);
    if (updateSqlRes.code === 0) {
      return updateSqlRes;
    }
    const updateRes = await ctx.model.query(updateSqlRes.data).catch(err => {
      result.code = 0;
      result.msg = '更新失败';
      result.data = err;
      logger.error(new Error(err));
      
    });
    if (result.code==0||!updateRes) return result;
    result.data = updateRes[0][0];
    return result;
  }

  async updateSql(tablename, datajson,epsg) {
    const result = {
      code: 1,
      data: '',
      msg: '',
    };
    let updateValueArr=[];
    for (const key in datajson) {
      if (datajson[key]) {
        if(key.indexOf("geom")!=-1){ // 空间字段
          updateValueArr.push(`"${key}"= public.ST_SetSRID(public.st_geomfromgeojson('${JSON.stringify(datajson[key])}'),${epsg})`);
        }else{
          const type = typeof datajson[key];
          if (type === 'object') {
            updateValueArr.push(`"${key}"='${JSON.stringify(datajson[key])}' `);
          } else {
            updateValueArr.push(`"${key}"='${datajson[key]}'`);
          }
        }
      } else {
        updateValueArr.push(`"${key}"=null`);
      }
    }
    let whereConds=" ";
    if(tablename.indexOf("geo_")!=-1){
      whereConds=`ogc_fid='${datajson["ogc_fid"]}'`; // ogc_fid  并不是所有空间数据表 主键id都为ogc_fid
    }else{
      whereConds=`id='${id}'`;
    }
    let sql=`update "${tablename}" set ${updateValueArr.join(',')} where ${whereConds} RETURNING *`;
    result.data=sql;
    return result;
  }
 
  // 通过那个查询
  async queryListCommon({limit=100,offset=0,tablename,order,ordertype}){ 
    const { logger } = this;
    const result = {
      code: 1,
      data: {},
      msg: '查询成功',
    };
    let listSql = 'select * from ' + tablename + ' where 1=1 ';
    let countSql = 'select count(*) from ' + tablename + ' where 1=1 ';
    let cond = ""; // 拓展搜索、高级查询功能
    listSql += cond;
    countSql += cond;
    if (order) {
      listSql += `  order by ${order} ${ordertype}`;
    } else {
      if(tablename.indexOf("geo_")!=-1){
         // 空间数据表可能无排序字段
      }else{
        listSql += '  order by cjsj DESC';// 业务表均新建cjsj字段
      }
    }
    if (limit) listSql += ` limit ${limit}`;
    if (offset) listSql += ` offset ${offset}`;
    const sql = `${listSql}; ${countSql};`;
    const listRes = await this.ctx.model.query(sql).catch(err => {
      result.code = 0;
      result.msg = '查询列表失败';
      result.data = err;
      logger.error(new Error(err));
    });
    if (listRes && listRes[1]) { result.data.list = listRes[1][0].rows; result.data.count = +listRes[1][1].rows[0].count; }
    return result;
  }
}
module.exports = CommonService;
