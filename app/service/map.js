
const util = require('../util');
const Service = require("egg").Service;
const zlib = require('zlib');
var UUID = require('uuid');
const rd = require('rd');
const fs = require('fs');
const path = require("path");

class Map extends Service {

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
      result.msg = "queryMvt生成mvt切片失败";
      result.data = err;
      logger.error(new Error(err));
    });

    if (!tileData) return result;
    // console.log(tileData[0][0].mvt.byteLength);

    if (tileData[0][0] == null || tileData[0][0].mvt.byteLength == 0) {
      result.code = 0;
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
    //result.data = tileData[0][0].mvt;
    return result;
  }
  
  async queryGeojson({tablename,tolerance=0}){
    const { ctx, config, logger } = this;
    let result = {
      code: 1,
      data: null,
      msg: null
    };
    let sql = `SELECT jsonb_build_object ('type','FeatureCollection','features',jsonb_agg (feature)) as geojson FROM 
    (SELECT jsonb_build_object ('type','Feature','geometry',ST_AsGeoJSON (st_simplify(st_Multi(geom),${tolerance}) ) :: jsonb,'properties',to_jsonb (ROW)  - 'geom') AS feature FROM 
    (SELECT * FROM "${tablename}"  where not ST_IsEmpty(geom)) ROW) features;`;
    // console.log(sql);
    let geojsonData = await ctx.model.query(sql).catch(err => {
      result.code = 0;
      result.msg = "queryGeojson生成geojson失败";
      result.data = err;
      logger.error(new Error(err));
    });
    if (result.code == 0) return result;
    if (geojsonData[0][0] == null) {
      result.code = 0;
      result.msg = "未生成geojson";
      result.data = new Buffer('');
      return result;
    }
    // result.data = tileData[0][0].mvt;
    // 设置 gzip body，修正响应头
    // const stream = zlib.createGzip();
    // stream.end(tileData[0][0].mvt);
    // result.data = stream;
    result.data = geojsonData[0][0].geojson;
    //result.data = tileData[0][0].mvt;
    return result;
  }

}
module.exports = Map;
