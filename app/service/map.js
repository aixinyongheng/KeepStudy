
const util = require('../util');
const Service = require("egg").Service;
const zlib = require('zlib');
var UUID = require('uuid');
const rd = require('rd');
const fs = require('fs');
const path = require("path");

class Map extends Service {
 
 
  //20191010
  async queryMvt(z, x, y, {tablename='geo_xian'}) {
    const { ctx, config, logger } = this;
    let result = {
      code: 1,
      data: null,
      msg: null
    };
    let z1 = Number(z);
    let x1 = Number(x);
    let y1 = Number(y);
    let [xmin, ymin] = util.xyz2lonlat(x1, y1, z1);
    let [xmax, ymax] = util.xyz2lonlat(x1 + 1, y1 + 1, z1);
    let tolerance = 0;
    //1-先查出来这个featureclass都有哪些非geom的字段
    //     let fieldsql = `select 'ogc_fid,' || array_to_string(array_agg(t.json_object_keys), ',') as fieldsname, data_id || '_' || name as layerid from
    // (select json_object_keys(field_list) from geoc_featureclass where data_id='${fid}') t`
    // 2-生成mvt
    //改3857 纯用4326缩放时会偏移
    // let sql = `(SELECT ST_AsMVT ( fmvt, '${fieldsname[0][0].layerid}', 4096, 'geom' ) as "${fieldsname[0][0].layerid}" FROM (SELECT ${fieldsname[0][0].fieldsname}, 
    //   ST_Simplify(ST_AsMVTGeom ( ST_Transform(geom, 4326), ST_MakeEnvelope ( ${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326 ), 4096, 64, TRUE),${tolerance},true) AS geom FROM "data_${fid}" 
    //  WHERE geom && ST_Transform (  ST_MakeEnvelope ( ${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326), 4326)) AS fmvt)`

    let sql = `SELECT ST_AsMVT ( buildingsmvt, '${tablename}', 4096, 'geom' ) as "${tablename}" FROM (SELECT  
      ST_AsMVTGeom (ST_Transform ( st_simplify (geom,${tolerance},true), 3857),
    ST_Transform ( ST_MakeEnvelope ( ${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326 ), 3857 ), 4096, 64, TRUE) AS geom FROM "${tablename}" 
    WHERE geom && ST_Transform (ST_Transform ( ST_MakeEnvelope ( ${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326), 3857), 4326) ) AS buildingsmvt`;

    // let sql = `SELECT ST_AsMVT ( buildingsmvt, 'data_11001001432', 4096, 'geom' ) as mvt FROM (SELECT ogc_fid,name,pac,pac1,fl, 
    //   ST_AsMVTGeom (ST_Transform ( st_simplify (geom,0,true), 3857),
    // ST_Transform ( ST_MakeEnvelope ( 118, 30, 120, 35, 4326 ), 3857 ), 4096, 64, TRUE) AS geom FROM "data_11001001432" 
    // WHERE geom && ST_Transform (ST_Transform ( ST_MakeEnvelope ( 118, 30, 120, 35, 4326), 3857), 4326) ) AS buildingsmvt`
    let tileData = await ctx.model.query(sql).catch(err => {
      result.code = 0;
      result.msg = "getMvtByFid生成featureclass的mvt失败";
      result.data = err;
      logger.error(new Error(err));
      // console.log(sql)
    });
    if (!tileData) return result;
    if (tileData[0][0] == null || tileData[0][0].buildingsmvt.byteLength == 0) {
      result.code = 0;
      result.msg = "未生成瓦片。";
      return result;
    }
    result.data = tileData[0][0].buildingsmvt;
    return result;
  }
  //20191011
  async queryMvt(z, x, y, {tablename='geo_xian'}) {
    const { ctx, config, logger } = this;
    let result = {
      code: 1,
      data: null,
      msg: null
    };
    let z1 = Number(z);
    let x1 = Number(x);
    let y1 = Number(y);
    let [xmin, ymin] = util.xyz2lonlat(x1, y1, z1);
    let [xmax, ymax] = util.xyz2lonlat(x1 + 1, y1 + 1, z1);
    let tolerance = 0;
    var sqls = [];
    let tablenameArr=tablename.split(",");
    for(const tablenameItem of tablenameArr){
      //改3857 纯用4326缩放时会偏移
      sqls.push(`(SELECT ST_AsMVT ( fmvt, '${tablenameItem}', 4096, 'geom' ) as "${tablenameItem}" FROM (SELECT  
        ST_AsMVTGeom (ST_Transform ( st_simplify (geom,${tolerance},true), 3857),
      ST_Transform ( ST_MakeEnvelope ( ${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326 ), 3857 ), 4096, 64, TRUE) AS geom FROM "${tablenameItem}" 
      WHERE geom && ST_Transform (ST_Transform ( ST_MakeEnvelope ( ${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326), 3857), 4326) ) AS fmvt)`);
    }
    // 3-生成mvt
    let sql = `SELECT ${sqls.join(' || ')} as mvt `;
    // console.log(sql);
    let tileData = await ctx.model.query(sql).catch(err => {
      result.code = 0;
      result.msg = "getMvtBySrcId生成featureclass的mvt失败";
      result.data = err;
      logger.error(new Error(err));
    });

    if (!tileData) return result;
    // console.log(tileData[0][0].mvt.byteLength);

    if (tileData[0][0] == null || tileData[0][0].mvt.byteLength == 0) {
      result.code = -1;
      result.msg = "未生成瓦片。";
      result.data = new Buffer('');
      return result;
    }

    // result.data = tileData[0][0].mvt;
    // 设置 gzip body，修正响应头
    // const stream = zlib.createGzip();
    // stream.end(tileData[0][0].mvt);
    // result.data = stream;
    result.data = zlib.gzipSync(tileData[0][0].mvt);
    return result;
  }
  

}
module.exports = Map;
